/**
 * Google Drive Manager - For handling Google Drive operations
 */

const GoogleDriveManager = {
    // API Configuration
    // Note: Please obtain the actual API key and client ID from Google Cloud Console
    // Visit: https://console.cloud.google.com/apis/credentials
    API_KEY: 'YOUR_API_KEY', // Replace with actual API key
    CLIENT_ID: 'YOUR_CLIENT_ID', // Replace with actual client ID
    CLIENT_SECRET: 'YOUR_CLIENT_SECRET', // Client secret
    SCOPES: 'https://www.googleapis.com/auth/drive.file',
    APP_FOLDER_NAME: 'FrameFlow Journals',
    
    // Folder ID cache
    appFolderId: null,
    
    /**
     * Initialize the Google Drive API
     * @returns {Promise} Promise that resolves when API is ready
     */
    init: async function() {
        console.log('Initializing Google Drive Manager');
        
        // Check if user is logged in with Google
        const token = localStorage.getItem('google_token');
        if (!token) {
            console.error('No Google token found. Please sign in with Google to use Drive features');
            return false;
        }
        
        try {
            // Load the API client library
            await this.loadGapiClient();
            
            // Set up the API with auth token
            await this.setupApi(token);
            
            // Ensure app folder exists
            await this.ensureAppFolderExists();
            
            console.log('Google Drive Manager initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Google Drive Manager:', error);
            return false;
        }
    },
    
    /**
     * Load the Google API client library
     * @returns {Promise} Promise that resolves when client is loaded
     */
    loadGapiClient: function() {
        return new Promise((resolve, reject) => {
            // Check if gapi is already loaded
            if (window.gapi && window.gapi.client) {
                resolve();
                return;
            }
            
            // Load the API client library
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                gapi.load('client', () => {
                    gapi.client.init({
                        apiKey: this.API_KEY,
                        clientId: this.CLIENT_ID,
                        clientSecret: this.CLIENT_SECRET,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
                    }).then(() => {
                        console.log('GAPI client loaded');
                        resolve();
                    }).catch(error => {
                        console.error('Error initializing GAPI client', error);
                        reject(error);
                    });
                });
            };
            script.onerror = () => {
                reject(new Error('Failed to load Google API client'));
            };
            document.body.appendChild(script);
        });
    },
    
    /**
     * Set up the API with authentication token
     * @param {string} token - Google authentication token
     * @returns {Promise} Promise that resolves when auth is complete
     */
    setupApi: function(token) {
        return new Promise((resolve, reject) => {
            try {
                gapi.client.setToken({ access_token: token });
                resolve();
            } catch (error) {
                console.error('Error setting up API with token:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Ensure application folder exists in Google Drive
     * @returns {Promise<string>} Promise that resolves with folder ID
     */
    ensureAppFolderExists: async function() {
        // Check if we already have the folder ID cached
        if (this.appFolderId) {
            return this.appFolderId;
        }
        
        try {
            // Search for existing folder
            const response = await gapi.client.drive.files.list({
                q: `name='${this.APP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                spaces: 'drive',
                fields: 'files(id, name)'
            });
            
            // If folder exists, use it
            if (response.result.files && response.result.files.length > 0) {
                this.appFolderId = response.result.files[0].id;
                console.log(`Found app folder: ${this.appFolderId}`);
                return this.appFolderId;
            }
            
            // Create new folder if none exists
            const createResponse = await gapi.client.drive.files.create({
                resource: {
                    name: this.APP_FOLDER_NAME,
                    mimeType: 'application/vnd.google-apps.folder'
                },
                fields: 'id'
            });
            
            this.appFolderId = createResponse.result.id;
            console.log(`Created app folder: ${this.appFolderId}`);
            return this.appFolderId;
        } catch (error) {
            console.error('Error ensuring app folder exists:', error);
            throw error;
        }
    },
    
    /**
     * Save journal image to Google Drive
     * @param {string} imageData - Base64 encoded image data
     * @param {string} filename - Filename to save
     * @param {string} journalId - Journal ID for reference
     * @returns {Promise<object>} Promise that resolves with file info
     */
    saveJournalImage: async function(imageData, filename, journalId) {
        try {
            // Ensure we have a folder
            const folderId = await this.ensureAppFolderExists();
            
            // Convert base64 to blob
            const blob = this.base64ToBlob(imageData);
            
            // Create file metadata
            const metadata = {
                name: filename,
                mimeType: 'image/png',
                parents: [folderId],
                appProperties: {
                    journalId: journalId
                }
            };
            
            // Upload file
            const accessToken = gapi.client.getToken().access_token;
            
            // Use fetch for binary upload
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', blob);
            
            const response = await fetch(
                'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webContentLink',
                {
                    method: 'POST',
                    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
                    body: form
                }
            );
            
            const result = await response.json();
            console.log('File uploaded to Google Drive:', result);
            
            return result;
        } catch (error) {
            console.error('Error saving journal image to Google Drive:', error);
            throw error;
        }
    },
    
    /**
     * Get journal image from Google Drive by journal ID
     * @param {string} journalId - Journal ID
     * @returns {Promise<string>} Promise that resolves with image data URL
     */
    getJournalImage: async function(journalId) {
        try {
            // Search for file by journal ID in app properties
            const response = await gapi.client.drive.files.list({
                q: `appProperties has { key='journalId' and value='${journalId}' } and trashed=false`,
                spaces: 'drive',
                fields: 'files(id, name, webContentLink)'
            });
            
            // If no file found
            if (!response.result.files || response.result.files.length === 0) {
                console.warn(`No image found for journal ID: ${journalId}`);
                return null;
            }
            
            // Get file metadata
            const file = response.result.files[0];
            console.log(`Found image for journal ${journalId}:`, file);
            
            // Download file content
            const accessToken = gapi.client.getToken().access_token;
            const fileResponse = await fetch(
                `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
                {
                    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken })
                }
            );
            
            // Convert to blob and then to data URL
            const blob = await fileResponse.blob();
            return await this.blobToDataUrl(blob);
        } catch (error) {
            console.error('Error getting journal image from Google Drive:', error);
            return null;
        }
    },
    
    /**
     * Delete journal image from Google Drive
     * @param {string} journalId - Journal ID
     * @returns {Promise<boolean>} Promise that resolves with success status
     */
    deleteJournalImage: async function(journalId) {
        try {
            // Search for file by journal ID in app properties
            const response = await gapi.client.drive.files.list({
                q: `appProperties has { key='journalId' and value='${journalId}' } and trashed=false`,
                spaces: 'drive',
                fields: 'files(id)'
            });
            
            // If no file found
            if (!response.result.files || response.result.files.length === 0) {
                console.warn(`No image found to delete for journal ID: ${journalId}`);
                return true; // Consider it successful if no file to delete
            }
            
            // Delete each matching file
            for (const file of response.result.files) {
                await gapi.client.drive.files.delete({
                    fileId: file.id
                });
                console.log(`Deleted file ${file.id} for journal ${journalId}`);
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting journal image from Google Drive:', error);
            return false;
        }
    },
    
    /**
     * Convert base64 data to Blob
     * @param {string} base64Data - Base64 encoded data
     * @returns {Blob} Blob object
     */
    base64ToBlob: function(base64Data) {
        // Remove data URL prefix (if present)
        const base64Content = base64Data.includes('base64,') 
            ? base64Data.split('base64,')[1] 
            : base64Data;
        
        // Decode base64
        const byteCharacters = atob(base64Content);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        
        return new Blob(byteArrays, { type: 'image/png' });
    },
    
    /**
     * Convert Blob to data URL
     * @param {Blob} blob - Blob object
     * @returns {Promise<string>} Promise that resolves with data URL
     */
    blobToDataUrl: function(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
};

// Export the manager if in a module environment
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = GoogleDriveManager;
} 