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
    
    let currentFile = null;
    
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
        
        statusText.textContent = 'Processing...';
        
        const formData = new FormData();
        formData.append('name', document.getElementById('documentName').value || 'Untitled');
        formData.append('description', 'Notarized via Trust-Seal');
        formData.append('document', currentFile);
        
        try {
            // Dynamic API URL for CodeSandbox compatibility
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
            console.error('Notarization error:', error);
        }
    });
    
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