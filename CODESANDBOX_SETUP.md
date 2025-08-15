# 🏗️ How to Set Up This Project in CodeSandbox

This VeChain document notarization service can be easily run and demonstrated in CodeSandbox. Follow these steps:

## 🚀 Quick Setup

### 1. Import to CodeSandbox

**Option A: Direct Import**
- Go to [CodeSandbox.io](https://codesandbox.io)
- Click "Import from GitHub"
- Paste this repository URL: `https://github.com/arkvdaogmail/vechain-notarization`
- CodeSandbox will automatically detect the Node.js project

**Option B: Fork from CodeSandbox**
- Visit: `https://codesandbox.io/s/github/arkvdaogmail/vechain-notarization`
- Click "Fork" to create your own copy

### 2. Configure Environment Variables

1. In CodeSandbox, click on "Server Control Panel" (bottom panel)
2. Go to "Environment" tab
3. Add the following environment variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
VECHAIN_ADDRESS=your_vechain_testnet_address
VECHAIN_PRIVATE_KEY=your_vechain_testnet_private_key
PORT=3000
```

### 3. Set Up Required Services

#### Supabase Database
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. In SQL Editor, run this schema:

```sql
CREATE TABLE notary_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_hash TEXT UNIQUE NOT NULL,
  vechain_tx_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  owner_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Copy your project URL and anon key to environment variables

#### VeChain Testnet Wallet
1. Create a VeChain testnet wallet using [VeWorld](https://www.veworld.net/) or similar
2. Get testnet VET from [VeChain Testnet Faucet](https://faucet.vecha.in/)
3. Copy your address and private key to environment variables

### 4. Start the Application

The application will automatically start when you open CodeSandbox. You'll see:
- Backend running on the main port (usually 3000)
- Frontend accessible via the preview window

### 5. Test the Application

1. Open the frontend in the preview panel
2. Upload a test document
3. Click "Notarize on Blockchain"
4. Check the verification status

## 📁 Project Structure

```
vechain-notarization/
├── app.js                 # Main Node.js server
├── package.json           # Dependencies and scripts
├── frontend/
│   ├── index.html        # Frontend UI
│   ├── app.js           # Frontend JavaScript
│   └── styles.css       # Styling
├── sandbox.config.json   # CodeSandbox configuration
└── .env.example         # Environment variables template
```

## 🔧 Features Demonstrated

- **Document Upload**: Drag-and-drop file upload interface
- **Hash Generation**: SHA-256 hashing of uploaded documents
- **Blockchain Notarization**: Recording document hashes on VeChain testnet
- **Database Storage**: Storing notarization records in Supabase
- **Verification**: Checking notarization authenticity

## 🎯 CodeSandbox Advantages

- **No Local Setup**: Run the entire application in your browser
- **Easy Sharing**: Share your sandbox with others instantly
- **Live Editing**: Make changes and see results immediately
- **Environment Management**: Secure environment variable handling
- **Automatic Deployment**: Your changes are live instantly

## 🔐 Security Notes

- This is a testnet implementation for demonstration purposes
- Never use real private keys in CodeSandbox
- The example uses VeChain testnet (no real value)
- Environment variables in CodeSandbox are only visible to you

## 🐛 Troubleshooting

**Dependencies Not Installing?**
- Check the CodeSandbox console for errors
- Try refreshing the sandbox

**Server Not Starting?**
- Verify all environment variables are set
- Check that PORT is set to 3000
- Look at the server logs in the bottom panel

**Frontend Not Loading?**
- Make sure the server is running first
- Check browser console for errors
- Verify the frontend is making requests to the correct backend URL

## 🤝 Contributing

To contribute or modify this CodeSandbox:
1. Fork the sandbox
2. Make your changes
3. Test thoroughly
4. Share your improved version!

## 📚 Learn More

- [VeChain Documentation](https://docs.vechain.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [CodeSandbox Documentation](https://codesandbox.io/docs)