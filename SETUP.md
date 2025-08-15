# VeChain Notarization Service - Setup Guide

## Quick Start (Demo Mode)

The application is now configured to run in **demo mode** by default, which means you can test all functionality without configuring any external services.

### Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser to: `http://localhost:3000`

The application will display:
```
⚠️  Supabase not configured - running in demo mode
⚠️  VeChain not configured - running in demo mode
🚀 VeChain Notarization Service running on port 3000
```

## Demo Mode Features

In demo mode, the application provides:
- ✅ Full UI functionality
- ✅ File upload and SHA-256 hashing
- ✅ Mock blockchain transaction IDs
- ✅ Simulated database records
- ✅ Document verification with demo data
- ✅ All API endpoints working

## Production Configuration

To enable full blockchain and database functionality:

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_anon_key

   # VeChain Configuration (Testnet)
   VECHAIN_ADDRESS=0x1234567890123456789012345678901234567890
   VECHAIN_PRIVATE_KEY=your_private_key_here

   # Server Configuration
   PORT=3000
   ```

3. Restart the application

With full configuration, you'll see:
```
✅ Supabase connected
✅ VeChain connected
🚀 VeChain Notarization Service running on port 3000
```

## API Endpoints

- `POST /notarize` - Upload and notarize a document
- `GET /verify/:hash` - Verify a document by its hash
- `GET /health` - Health check endpoint

## Security Notes

- Never commit your `.env` file to version control
- Use testnet addresses for development
- Keep private keys secure and never share them

## Troubleshooting

If you see the error:
```
Error: supabaseUrl is required.
```

This means you're running an older version. The current version includes graceful fallback handling and will run in demo mode when environment variables are not configured.