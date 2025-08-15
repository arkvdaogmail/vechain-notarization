# VeChain Document Notarization Service

A blockchain-based document notarization service built on VeChain testnet with a modern web interface.

## 🚀 Quick Start in CodeSandbox

### One-Click Setup
[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/arkvdaogmail/vechain-notarization)

### Manual Setup
1. **Import Project**: Go to [CodeSandbox.io](https://codesandbox.io) → Import from GitHub → Use this repo URL
2. **Configure Environment**: See [CODESANDBOX_SETUP.md](CODESANDBOX_SETUP.md) for detailed instructions
3. **Start**: The app runs automatically - check the preview panel!

## 🏗️ What This Does

- **Upload Documents**: Secure file upload with drag-and-drop interface
- **Generate Hash**: SHA-256 hash generation for document integrity
- **Blockchain Notarization**: Record document hashes on VeChain testnet
- **Database Storage**: Store notarization records in Supabase
- **Verification**: Verify document authenticity using blockchain records

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
└── CODESANDBOX_SETUP.md    # Detailed setup guide
```

## 🌐 API Endpoints

- `GET /` - Frontend interface
- `POST /notarize` - Upload and notarize document
- `GET /verify/:hash` - Verify document notarization
- `GET /health` - Health check

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key  
VECHAIN_ADDRESS=your_vechain_testnet_address
VECHAIN_PRIVATE_KEY=your_vechain_testnet_private_key
PORT=3000
```

## 🧪 Testing in CodeSandbox

1. **Upload a file** - Try the drag-and-drop interface
2. **Notarize** - Click "Notarize on Blockchain" 
3. **Verify** - Use the returned hash to verify the document
4. **Check blockchain** - Visit the VeChain explorer link

## 🤝 Contributing

1. Fork this CodeSandbox
2. Make your improvements
3. Test thoroughly
4. Share your enhanced version!

## 📚 Learn More

- [Full Setup Guide](CODESANDBOX_SETUP.md)
- [VeChain Documentation](https://docs.vechain.org/)
- [Supabase Documentation](https://supabase.com/docs)

---

**Demo ready!** 🎉 This project is optimized for immediate deployment in CodeSandbox.