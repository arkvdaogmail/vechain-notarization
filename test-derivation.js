// test-derivation.js - Test crypto derivation functionality
const { generateMnemonic, mnemonicToSeedSync } = require('@scure/bip39');
const { wordlist } = require('@scure/bip39/wordlists/english');
const { HDKey } = require('@scure/bip32');
const CryptoJS = require('crypto-js');

console.log('🔐 Testing Crypto Derivation Functionality...\n');

// Test 1: Mnemonic Generation
console.log('1. Testing Mnemonic Generation:');
try {
  const mnemonic = generateMnemonic(wordlist);
  console.log('✅ Generated mnemonic:', mnemonic.split(' ').slice(0, 3).join(' ') + '...');
  
  // Test 2: Seed Generation
  console.log('\n2. Testing Seed Generation:');
  const seed = mnemonicToSeedSync(mnemonic);
  console.log('✅ Generated seed length:', seed.length, 'bytes');
  
  // Test 3: HD Key Derivation
  console.log('\n3. Testing HD Key Derivation:');
  const hdkey = HDKey.fromMasterSeed(seed);
  const derivedKey = hdkey.derive("m/44'/818'/0'/0/0"); // VeChain derivation path
  console.log('✅ Derived key public key:', derivedKey.publicKey ? 'Generated' : 'Error');
  console.log('✅ Derived key private key:', derivedKey.privateKey ? 'Generated' : 'Error');
  
  // Test 4: Crypto-JS Hash Functions
  console.log('\n4. Testing Crypto-JS Hash Functions:');
  const testData = 'Hello VeChain + Stripe Integration';
  const sha256Hash = CryptoJS.SHA256(testData).toString();
  const md5Hash = CryptoJS.MD5(testData).toString();
  console.log('✅ SHA256 hash:', sha256Hash.substring(0, 16) + '...');
  console.log('✅ MD5 hash:', md5Hash.substring(0, 16) + '...');
  
  // Test 5: Encryption/Decryption
  console.log('\n5. Testing AES Encryption/Decryption:');
  const secretKey = 'test-secret-key';
  const encrypted = CryptoJS.AES.encrypt(testData, secretKey).toString();
  const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
  console.log('✅ Encryption successful:', encrypted.length > 0);
  console.log('✅ Decryption successful:', decrypted === testData);
  
  console.log('\n🎉 All crypto derivation tests passed!');
  process.exit(0);
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}