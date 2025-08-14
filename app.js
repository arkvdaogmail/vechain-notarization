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

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// CORRECTED LOGIC FOR VECHAIN SDK
// 1. Create a ThorClient instance with the network URL
const thor = ThorClient.at("https://testnet.vechain.org/");

// 2. Pass the ThorClient instance to the VeChainProvider constructor
const vechain = new VeChainProvider(thor);

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

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notarization service running on port ${PORT}`);
  console.log(`Endpoints:
  POST /notarize    - Upload document to notarize
  GET /verify/:hash - Verify notarization record`);
});
