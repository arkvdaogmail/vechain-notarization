// app.js - Complete Notarization App
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const { ThorClient, VeChainProvider } = require("@vechain/sdk-network");

// Initialize Express
const app = express();
app.use(express.json());

// CORS configuration for CodeSandbox compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize Supabase (with graceful fallback)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
  console.log("✅ Supabase connected");
} else {
  console.log("⚠️  Supabase not configured - running in demo mode");
}

// Initialize VeChain (with graceful fallback)
let vechain = null;
let thor = null;
if (process.env.VECHAIN_ADDRESS && process.env.VECHAIN_PRIVATE_KEY) {
  try {
    thor = ThorClient.at("https://testnet.vechain.org/");
    vechain = new VeChainProvider(thor);
    console.log("✅ VeChain connected");
  } catch (error) {
    console.log("⚠️  VeChain connection failed:", error.message);
  }
} else {
  console.log("⚠️  VeChain not configured - running in demo mode");
}

// Generate SHA-256 hash of file
function hashFile(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

// Notarization Endpoint
app.post("/notarize", upload.single("document"), async (req, res) => {
  try {
    // 1. Validate file
    if (!req.file) throw new Error("No file uploaded");
    const file = req.file;

    // 2. Generate document hash
    const documentHash = hashFile(file.buffer);

    // Check if we're in demo mode
    if (!vechain || !supabase) {
      // Demo mode response
      return res.json({
        success: true,
        documentHash,
        vechainTx: "demo_tx_" + Math.random().toString(36).substr(2, 9),
        demoMode: true,
        message: "Demo mode - configure environment variables for full functionality",
        supabaseRecord: {
          id: "demo_id_" + Math.random().toString(36).substr(2, 9),
          document_hash: documentHash,
          file_name: file.originalname,
          file_size: file.size,
          file_type: file.mimetype,
          created_at: new Date().toISOString()
        }
      });
    }

    // 3. Create Vechain transaction (testnet)
    const txResponse = await vechain.transactions.sendTransaction(
      {
        from: process.env.VECHAIN_ADDRESS,
        to: process.env.VECHAIN_ADDRESS, // Self-transfer
        value: 0,
        data: `0x${Buffer.from(`Notarized:${documentHash}`).toString("hex")}`,
      },
      process.env.VECHAIN_PRIVATE_KEY
    );

    // 4. Store record in Supabase
    const { data, error: dbError } = await supabase
      .from("notary_records")
      .insert([
        {
          document_hash: documentHash,
          vechain_tx_id: txResponse.id,
          file_name: file.originalname,
          file_size: file.size,
          file_type: file.mimetype,
          owner_address: process.env.VECHAIN_ADDRESS,
        },
      ])
      .select();

    if (dbError) throw dbError;

    // 5. Return success
    res.json({
      success: true,
      documentHash,
      vechainTx: txResponse.id,
      supabaseRecord: data[0],
    });
  } catch (error) {
    res.status(500).json({
      error: "Notarization failed",
      details: error.message,
    });
  }
});

// Verification Endpoint
app.get("/verify/:hash", async (req, res) => {
  try {
    const { hash } = req.params;

    // Check if we're in demo mode
    if (!supabase || !vechain) {
      // Demo mode - simulate verification for demo hashes
      if (hash.startsWith("demo_") || hash.length === 64) {
        return res.json({
          verified: true,
          timestamp: new Date(),
          demoMode: true,
          message: "Demo mode - configure environment variables for full functionality",
          record: {
            id: "demo_record_id",
            document_hash: hash,
            vechain_tx_id: "demo_tx_" + Math.random().toString(36).substr(2, 9),
            file_name: "demo_document.pdf",
            file_size: 12345,
            file_type: "application/pdf",
            owner_address: "0xDemo1234567890123456789012345678901234567890",
            created_at: new Date().toISOString()
          }
        });
      } else {
        throw new Error("Record not found - Demo mode active");
      }
    }

    // 1. Check Supabase
    const { data, error } = await supabase
      .from("notary_records")
      .select()
      .eq("document_hash", hash);

    if (error || !data.length) throw new Error("Record not found");

    // 2. Verify Vechain transaction
    const tx = await vechain.transactions.getTransaction(data[0].vechain_tx_id);

    if (!tx) throw new Error("Transaction not found on chain");

    // 3. Return verification
    res.json({
      verified: true,
      timestamp: new Date(tx.meta.blockTimestamp),
      record: data[0],
      vechainTx: tx,
    });
  } catch (error) {
    res.status(404).json({
      verified: false,
      error: error.message,
    });
  }
});

// Health Check Endpoint (useful for CodeSandbox testing)
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "VeChain Notarization Service",
    environment: process.env.NODE_ENV || "development"
  });
});

// Serve static files for frontend (CodeSandbox compatibility)
app.use(express.static('frontend'));

// Root endpoint redirects to frontend
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 VeChain Notarization Service running on port ${PORT}`);
  console.log(`📁 Frontend available at: http://localhost:${PORT}`);
  console.log(`🔗 API Endpoints:
  POST /notarize      - Upload document to notarize
  GET  /verify/:hash  - Verify notarization record
  GET  /health        - Health check`);
  
  // CodeSandbox-specific messaging
  if (process.env.CODESANDBOX_SSE) {
    console.log(`🏗️  Running in CodeSandbox - Check the preview panel!`);
  }
});
