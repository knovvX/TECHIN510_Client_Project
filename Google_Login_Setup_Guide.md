# Google Login Error Troubleshooting Guide

The "Authorization Error" (Error 400: invalid_request) you encountered is due to Google OAuth not allowing insecure access when directly accessing web pages through the file system (file://). Here are the complete steps for fixing this issue:

## Access the Application Using a Local Server

To solve the file system access limitation, you need to access the application through an HTTP server:

### Method 1: Using Python's built-in HTTP server (Recommended)
1. Open Command Prompt or PowerShell
2. Navigate to the project folder: `cd \"D:\\UW\\2025 Spring\\User Interface\\Multi-media Journal\"`
3. Run the command: `python -m http.server 8000`
4. Access in browser: `http://localhost:8000`

### Method 2: Using Visual Studio Code's Live Server extension
1. Install the Live Server extension in VS Code
2. Right-click on index.html and select "Open with Live Server"
3. The browser will open automatically with the correct URL

## Configure Google API Credentials

To make Google Sign-In work correctly:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Create or select your project
4. Set up OAuth consent screen (External type is fine for testing)
5. Create OAuth Client ID credentials for a Web Application
6. Add Authorized JavaScript origins:
   - `http://localhost:8000`
   - `http://127.0.0.1:8000` 
7. Add Authorized redirect URIs:
   - `http://localhost:8000`
   - `http://127.0.0.1:8000`

### Update application code
1. Make sure the client ID in `js/google-drive-manager.js` is correct
   ```javascript
   API_KEY: 'YOUR_API_KEY', 
   CLIENT_ID: 'YOUR_CLIENT_ID',
   CLIENT_SECRET: 'YOUR_CLIENT_SECRET', // Add your Client Secret here
   ```

2. Ensure the client ID in `login.html` is the same
   ```html
   <div id="g_id_onload"
      data-client_id="YOUR_CLIENT_ID"
      data-client_secret="YOUR_CLIENT_SECRET"
      ...
   ```

## Troubleshooting Common Errors

### Error 400: redirect_uri_mismatch
- Make sure the redirect URI specified in your code exactly matches the one in Google Cloud Console
- Check that you're accessing the app via http://localhost:8000 and not via file://

### Error 401: invalid_client
- Make sure your client ID and client secret are correct
- Check that the OAuth consent screen is properly configured
- Ensure your Google Cloud project is active

## Additional Tips

- Clear browser cache and cookies if issues persist
- Try using Incognito/Private browsing mode for testing
- Make sure date/time settings are correct on your computer

## Google Cloud Console Configuration Steps

### 1. Create a Google Cloud project (if not already created)
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

### 2. Enable necessary APIs
1. Go to "APIs & Services" > "Library"
2. Search for and enable:
   - Google Drive API
   - Google Identity Services

### 3. Create OAuth credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" type
4. Add your application access URLs to "Authorized JavaScript origins":
   - `http://localhost:8000`
   - `http://127.0.0.1:8000`
5. Click "Create" and copy the generated client ID

### 4. Create API key
1. On the "Credentials" page, click "Create Credentials" > "API Key"
2. Copy the generated API key

### 5. Update application code
1. Make sure the client ID in `js/google-drive-manager.js` is correct
   ```javascript
   API_KEY: 'YOUR_API_KEY', 
   CLIENT_ID: 'YOUR_CLIENT_ID',
   CLIENT_SECRET: 'YOUR_CLIENT_SECRET',
   ```

2. Ensure the client ID in `login.html` is the same
   ```html
   <div id="g_id_onload"
      data-client_id="YOUR_CLIENT_ID"
      data-client_secret="YOUR_CLIENT_SECRET"
      ...
   ```

### 6. Test users
1. Go to "APIs & Services" > "OAuth consent screen"
2. Add your email (wch1007@uw.edu) in the test users section

## Special Notes

1. When you access the application through a file system path (like file:///D:/UW/...), Google OAuth will reject authorization
2. You must access the application through the HTTP protocol (such as http://localhost:8000)
3. Ensure that the redirect URI and JavaScript origins added in the Google Cloud Console exactly match the URL you're actually using to access the application

If you still encounter problems after following the steps above, please ensure:
1. Check the browser console for detailed error messages
2. Confirm that you're logged into that Google account in the browser
3. Verify that your Google Cloud project is enabled

## Common Error Code Explanations

- `Error 400: invalid_request`: Usually indicates that request parameters (such as client ID) are incorrect or the source URL is not authorized
- `Error 401: unauthorized`: Could be an API key issue or the API is not enabled
- `Error 403: access_denied`: May be due to insufficient scope permissions or OAuth consent screen configuration issues 