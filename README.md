# VeChain Document Notarization Service

A blockchain-based document notarization service built on VeChain testnet with a modern web interface.

## 🚀 Quick Start (Demo Mode)

### Instant Demo - No Configuration Required!
```bash
npm install
npm start
```
Open `http://localhost:3000` - **Works immediately in demo mode!**

### One-Click Setup in CodeSandbox
[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/arkvdaogmail/vechain-notarization)

### For Production Setup
1. **Import Project**: Go to [CodeSandbox.io](https://codesandbox.io) → Import from GitHub → Use this repo URL
2. **Configure Environment**: See [SETUP.md](SETUP.md) for detailed instructions
3. **Start**: The app runs automatically - check the preview panel!

## 🏗️ What This Does

- **🎮 Demo Mode**: Works immediately without any configuration
- **📁 Upload Documents**: Secure file upload with drag-and-drop interface
- **🔒 Generate Hash**: SHA-256 hash generation for document integrity
- **💳 Payment Processing**: Secure Stripe payment integration for notarization fees
- **⛓️ Blockchain Notarization**: Record document hashes on VeChain testnet
- **💾 Database Storage**: Store notarization records in Supabase
- **✅ Verification**: Verify document authenticity using blockchain records

### Demo Mode Features
- Mock blockchain transactions with realistic IDs
- Simulated database storage
- Full UI functionality
- All API endpoints operational
- Perfect for testing and development

## 🔧 Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Blockchain**: VeChain SDK (Testnet)
- **Database**: Supabase
- **Deployment**: CodeSandbox ready

## 📁 Project Structure

```
vechain-notarization/
├── app.js                    # Main server with API endpoints
├── package.json              # Dependencies and scripts
├── frontend/
│   ├── index.html           # User interface
│   ├── app.js              # Frontend logic
│   └── styles.css          # Styling
├── sandbox.config.json      # CodeSandbox configuration
├── .env.example            # Environment variables template
├── .env                    # Environment configuration (demo mode by default)
├── SETUP.md               # Detailed setup and configuration guide
└── CODESANDBOX_SETUP.md    # CodeSandbox-specific setup guide
```

## 🌐 API Endpoints

- `GET /` - Frontend interface
- `POST /notarize` - Upload and notarize document (requires payment in production)
- `GET /verify/:hash` - Verify document notarization
- `POST /create-payment-session` - Create Stripe payment session
- `GET /verify-payment/:sessionId` - Verify payment completion
- `GET /stripe-config` - Get Stripe configuration for frontend
- `POST /webhook` - Stripe webhook handler
- `GET /health` - Health check

## 🔐 Environment Configuration

**Demo Mode (Default)**: The app works immediately without any configuration!

**Production Mode**: Copy `.env.example` to `.env` and configure:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key  

# VeChain Configuration (Testnet)
VECHAIN_ADDRESS=your_vechain_testnet_address
VECHAIN_PRIVATE_KEY=your_vechain_testnet_private_key

# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NOTARIZATION_PRICE=500  # Price in cents (500 = $5.00)

# Server Configuration
PORT=3000
```

See [SETUP.md](SETUP.md) for detailed configuration instructions.

## 💳 Payment Integration

### How It Works
1. **Upload Document**: User selects a document for notarization
2. **Payment Required**: When Stripe is configured, users must pay before notarization
3. **Secure Payment**: Uses Stripe Checkout for secure payment processing
4. **Blockchain Notarization**: After successful payment, document is notarized on VeChain
5. **Permanent Record**: Both payment and blockchain transaction are recorded

### Payment Flow
```
Upload Document → Pay via Stripe → Verify Payment → Notarize on Blockchain → Success
```

### Demo Mode vs Production
- **Demo Mode**: No payment required, free notarization for testing
- **Production Mode**: Stripe payment required before notarization

### Setting Up Payments
1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Configure webhook endpoint: `https://yourdomain.com/webhook`
4. Add Stripe keys to your `.env` file
5. Set `NOTARIZATION_PRICE` in cents (500 = $5.00)

## 🧪 Testing

### Demo Mode (No setup required)
1. **Start**: `npm install && npm start`
2. **Upload a file** - Try the drag-and-drop interface
3. **Notarize** - Click "Notarize on Blockchain" (creates demo transaction)
4. **Verify** - Use the returned hash to verify the document
5. **Check demo blockchain** - Visit the mock VeChain explorer link

### Production Mode
Follow the same steps after configuring real VeChain and Supabase credentials in `.env`.

## 🤝 Contributing

1. Fork this CodeSandbox
2. Make your improvements
3. Test thoroughly
4. Share your enhanced version!

## 📚 Learn More

- [Setup Guide](SETUP.md) - Detailed configuration instructions
- [VeChain Documentation](https://docs.vechain.org/)
- [Supabase Documentation](https://supabase.com/docs)

---

**🎉 Demo ready out of the box!** This project works immediately without any configuration required. Perfect for testing, development, and demonstrations!