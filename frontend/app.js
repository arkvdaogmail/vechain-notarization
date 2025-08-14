document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const notarizeBtn = document.getElementById('notarizeBtn');
    const documentHash = document.getElementById('documentHash');
    const txId = document.getElementById('txId');
    const statusText = document.getElementById('statusText');
    const fileInfo = document.getElementById('fileInfo');
    
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
            const response = await fetch('http://localhost:5002/notarize', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                documentHash.textContent = result.documentHash;
                txId.textContent = result.txId;
                statusText.textContent = 'Successfully notarized!';
                
                // Show explorer link
                fileInfo.innerHTML += `
                    <div class="success-message">
                        <a href="https://explore-testnet.vechain.org/transactions/${result.txId}" target="_blank">
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
    
    // Helper function
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});