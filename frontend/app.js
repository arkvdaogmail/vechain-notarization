document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const notarizeBtn = document.getElementById('notarizeBtn');
    const verifyBtn = document.getElementById('verifyBtn');
    const documentHash = document.getElementById('documentHash');
    const txId = document.getElementById('txId');
    const statusText = document.getElementById('statusText');
    const fileInfo = document.getElementById('fileInfo');
    const verifyHash = document.getElementById('verifyHash');
    const verifyResult = document.getElementById('verifyResult');
    const pricingInfo = document.getElementById('pricingInfo');
    const priceDisplay = document.getElementById('priceDisplay');
    
    let currentFile = null;
    let stripe = null;
    let stripeConfig = null;
    
    // Initialize Stripe and load configuration
    async function initializeStripe() {
        try {
            const response = await fetch(window.location.origin + '/stripe-config');
            stripeConfig = await response.json();
            
            if (stripeConfig.publishableKey) {
                // Show pricing information when Stripe is configured
                priceDisplay.textContent = `$${(stripeConfig.price / 100).toFixed(2)}`;
                pricingInfo.style.display = 'block';
                notarizeBtn.textContent = 'Pay & Notarize on Blockchain';
                
                try {
                    stripe = Stripe(stripeConfig.publishableKey);
                    console.log('Stripe initialized successfully');
                } catch (error) {
                    console.log('Stripe library not loaded, but payment system is configured');
                    // In a real environment, this would work
                }
            } else {
                console.log('Running in demo mode - Stripe not configured');
                notarizeBtn.textContent = 'Notarize on Blockchain (Demo)';
            }
        } catch (error) {
            console.error('Failed to initialize Stripe:', error);
            notarizeBtn.textContent = 'Notarize on Blockchain (Demo)';
        }
    }
    
    // Check for payment success on page load
    function checkPaymentStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        const sessionId = urlParams.get('session_id');
        
        if (paymentStatus === 'success' && sessionId) {
            statusText.textContent = 'Payment successful! You can now upload and notarize your document.';
            statusText.style.color = '#00bc8c';
            // Store session ID for notarization
            sessionStorage.setItem('paymentSessionId', sessionId);
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (paymentStatus === 'cancelled') {
            statusText.textContent = 'Payment cancelled. Please try again.';
            statusText.style.color = '#ff6b6b';
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    // Initialize on page load
    initializeStripe();
    checkPaymentStatus();
    
    // Event Listeners
    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            currentFile = e.target.files[0];
            fileInfo.innerHTML = `
                <div class="file-preview">
                    <strong>${currentFile.name}</strong> (${formatFileSize(currentFile.size)})
                </div>
            `;
        }
    });
    
    notarizeBtn.addEventListener('click', async () => {
        if (!currentFile) {
            alert('Please upload a document first');
            return;
        }
        
        // Check if we have a valid payment session or if we're in demo mode
        const paymentSessionId = sessionStorage.getItem('paymentSessionId');
        
        if (stripeConfig && !stripeConfig.demoMode && !paymentSessionId) {
            // Redirect to payment
            await initiatePayment();
            return;
        }
        
        // Proceed with notarization
        await processNotarization(paymentSessionId);
    });
    
    async function initiatePayment() {
        try {
            statusText.textContent = 'Redirecting to payment...';
            
            const response = await fetch(window.location.origin + '/create-payment-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: currentFile.name
                })
            });
            
            const session = await response.json();
            
            if (session.success) {
                // Redirect to Stripe Checkout
                window.location.href = session.url;
            } else if (session.demoMode) {
                // Demo mode - proceed without payment
                await processNotarization();
            } else {
                throw new Error(session.error || 'Failed to create payment session');
            }
        } catch (error) {
            statusText.textContent = 'Payment error: ' + error.message;
            console.error('Payment error:', error);
        }
    }
    
    async function processNotarization(paymentSessionId = null) {
        statusText.textContent = 'Processing notarization...';
        
        const formData = new FormData();
        formData.append('name', document.getElementById('documentName').value || 'Untitled');
        formData.append('description', 'Notarized via Trust-Seal');
        formData.append('document', currentFile);
        if (paymentSessionId) {
            formData.append('paymentSessionId', paymentSessionId);
        }
        
        try {
            const apiUrl = window.location.origin + '/notarize';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                documentHash.textContent = result.documentHash;
                txId.textContent = result.vechainTx;
                statusText.textContent = 'Successfully notarized!';
                statusText.style.color = '#00bc8c';
                
                // Clear payment session
                sessionStorage.removeItem('paymentSessionId');
                
                // Show explorer link
                fileInfo.innerHTML += `
                    <div class="success-message">
                        <a href="https://explore-testnet.vechain.org/transactions/${result.vechainTx}" target="_blank">
                            View on Blockchain Explorer
                        </a>
                    </div>
                `;
            } else {
                throw new Error(result.error || 'Notarization failed');
            }
        } catch (error) {
            statusText.textContent = 'Error: ' + error.message;
            statusText.style.color = '#ff6b6b';
            console.error('Notarization error:', error);
        }
    }
    
    // Verification Event Listener
    verifyBtn.addEventListener('click', async () => {
        const hashToVerify = verifyHash.value.trim();
        
        if (!hashToVerify) {
            alert('Please enter a document hash to verify');
            return;
        }
        
        verifyResult.innerHTML = '<div class="loading">Verifying...</div>';
        
        try {
            const apiUrl = window.location.origin + '/verify/' + hashToVerify;
            const response = await fetch(apiUrl);
            const result = await response.json();
            
            if (result.verified) {
                verifyResult.innerHTML = `
                    <div class="success-message">
                        <h3>✅ Document Verified!</h3>
                        <p><strong>Notarized:</strong> ${new Date(result.timestamp).toLocaleString()}</p>
                        <p><strong>File:</strong> ${result.record.file_name}</p>
                        <p><strong>Size:</strong> ${formatFileSize(result.record.file_size)}</p>
                        <p><strong>Type:</strong> ${result.record.file_type}</p>
                        <a href="https://explore-testnet.vechain.org/transactions/${result.record.vechain_tx_id}" target="_blank">
                            View Transaction on Blockchain
                        </a>
                    </div>
                `;
            } else {
                verifyResult.innerHTML = `
                    <div class="error-message">
                        <h3>❌ Verification Failed</h3>
                        <p>Document hash not found in notarization records.</p>
                    </div>
                `;
            }
        } catch (error) {
            verifyResult.innerHTML = `
                <div class="error-message">
                    <h3>❌ Verification Error</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    });
    
    // Helper function
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});