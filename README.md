# 🧠 Multi-media Journal with AI-powered Chatbot Companion

A Streamlit-based multimedia journaling application that supports uploading images, audio, video, and mood tracking.

## 🎯 Project Overview

This project aims to build a website allowing users to take journals in multi-media forms. Users can record their thoughts, inspirations, and experiences using text, images, videos, audio clips, and more. The website supports flexible layouts and smart tools to help users organize and revisit their content meaningfully.

## ✨ Features

* 📸 Multi-media Support (Images, Audio, Video)
* 🎨 Mood Tracking and Recording
* 📝 Journal Text Editor
* 💾 Local Data Storage
* 🔍 History Viewing
* 📊 Media Description and Tagging
* 🤖 AI Chatbot Assistant (Coming Soon)

## 👥 Target Users

| User Types                          | Needs                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Content Creators                    | Need to take records of contents frequently and need to collect inspirations from different media types |
| Users who prefer visual memory aids | Need the aids with images, videos or music in journals to better memorize                               |
| Film Critics                        | Need movie clips or images to help sort the reviews                                                     |

## 🚀 Getting Started

### Prerequisites

* A modern web browser (e.g., Chrome, Firefox, Edge, Safari)

### Running the Application

1. Clone the repository (if you haven't already):
```bash
git clone https://github.com/knovvX/TECHIN510_Client_Project.git
cd TECHIN510_Client_Project
```

2. Open the `index.html` file directly in your web browser.

## 📁 Project Structure

```
Multi-media Journal/
├── css/                     # CSS files (if any)
├── fonts/                   # Font files
├── images/                  # Image assets (stickers, placeholders, etc.)
├── js/                      # JavaScript files
│   ├── editor-core.js       # Core editor logic
│   ├── editor-elements.js   # Canvas element management
│   ├── sticker-handler.js   # Sticker loading and interaction
│   ├── local-storage-manager.js # LocalStorage interaction
│   └── ...                  # Other JS modules
├── index.html               # Main landing page
├── journal.html             # Page to display saved journals
├── editor.html              # Journal editor page
├── styles.css               # Main CSS styles for index.html
├── editor.css               # CSS styles specific to the editor
├── reading-journal.css      # CSS for reading journal page (if separate)
└── README.md                # Project documentation
```

## 💡 Usage Guide

1. **Media Upload**:  
   * Supports PNG, JPG, JPEG images  
   * Supports MP4 videos  
   * Supports MP3 audio files  
   * Add descriptions to each media file  
   * File size limit: 200MB
2. **Mood Recording**:  
   * Choose from 6 different mood states  
   * Add journal entries  
   * View history
3. **Data Storage**:  
   * All data stored locally in SQLite database  
   * Automatic saving  
   * Persistent storage

## ⏰ Development Timeline

| Task                                  | Start Date / End Date |
| ------------------------------------- | --------------------- |
| Design pages and basic layout         | 4.7 / 4.14            |
| Implement static layout and moodboard | 4.15 / 4.21           |
| Build database for user management    | 4.22 / 4.28           |
| Enable media upload                   | 4.29 / 5.3            |
| Embed chatbot                         | 5.4 / 5.10            |
| Final polish and documentation        | 5.11 / 5.13           |

## 👥 Team

* Developer: Chenghao Wang (@wch1007)
* Client: Diyun Lu (@knovvX)

## 📞 Contact Information

Feel free to reach out if you have any questions or suggestions:

* **Developer Contact**:  
   * Email: wch1007@uw.edu  
   * WeChat: wch18501284401  
   * Instagram: caelen_wang  
   * GitHub: @wch1007
* **Project Links**:  
   * Repository: TECHIN510_Client_Project  
   * Issues: GitHub Issues
* **University**: University of Washington
* **Course**: TECHIN510 25 Spring

## 🤝 Contributing

Issues and Pull Requests are welcome to help improve the project!

## 📄 License

MIT License

## 🔄 Latest Updates

### Week of April 22, 2025
- Fixed issues with editor components interaction
- Implemented local database storage using IndexedDB
- Added journal preview functionality in the reading journal page
- Created persistent storage for journal content
- Added ability to reload previously saved journals
- Fixed file upload mechanism in editor

### Week of April 15, 2025
- Redesigned the journal interface with a more intuitive layout
- Improved page structure for better user experience
- Note: Clipboard functionality is currently under maintenance and not working

### Week of May 2, 2025

**Key Updates:**
- **UI Overhaul:** Give up Streamlit. Change to HTML & JS. Implemented significant visual design and structural changes for a more modern and aesthetically pleasing interface, moving away from the initial Streamlit look.
- **Enhanced Page Transitions:** Improved the flow and transitions between different pages (e.g., Editor to Journal List).
- **Sticker Feature:** Added a comprehensive sticker library with categories. Users can browse stickers in a sidebar and drag-and-drop them onto the canvas.
- **File Upload:** Enabled direct image file uploads into the editor canvas.
- **Element Interaction:** Optimized resizing and rotation functionality for elements on the canvas, including options for center-based and corner-based scaling.
- **Streamlined Save Workflow:** Clicking the 'Save' button now saves the journal content as a PNG to localStorage, triggers a browser print dialog (for saving as PDF/PNG), and then *immediately* redirects to the main journal list page, displaying the newly saved journal.

**Known Issues & Bugs:**
- **Saving Reliability:** The process of saving journals to localStorage and reliably reloading them might still be unstable. Some saves might not persist correctly.
- **Editor Functionality Gaps:** Several core editor features might be missing or not fully functional (e.g., adding certain element types, property panel interactions, layer management). Further testing and development are needed to ensure all editor components work as expected.
- **Data Persistence:** While localStorage is used, there's no robust backend or cloud sync, meaning data is only stored locally in the browser and can be lost.

## ✅ Testing Notes

Basic functional tests were performed on key features, including:
- **File Upload:** Tested uploading image files directly to the editor canvas.
- **Sticker Functionality:** Verified sticker library loading, category selection, and drag-and-drop onto the canvas.
- **Save/Print Workflow:** Tested the process of saving the journal, triggering the print dialog, and redirecting to the journal list.

*Note: These were manual tests. More comprehensive automated testing is recommended for future development.* 