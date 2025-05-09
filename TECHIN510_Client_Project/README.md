# 🧠 Multi-media Journal with AI-powered Chatbot Companion

A Streamlit-based multimedia journaling application that supports uploading images, audio, video, and mood tracking.

## 🎯 Project Overview

This project aims to build a website allowing users to take journals in multi-media forms. Users can record their thoughts, inspirations, and experiences using text, images, videos, audio clips, and more. The website supports flexible layouts and smart tools to help users organize and revisit their content meaningfully.

## ✨ Features

- 📸 Multi-media Support (Images, Audio, Video)
- 🎨 Mood Tracking and Recording
- 📝 Journal Text Editor
- 💾 Local Data Storage
- 🔍 History Viewing
- 📊 Media Description and Tagging
- 🤖 AI Chatbot Assistant (Coming Soon)

## 👥 Target Users

| User Types | Needs |
| ---------- | ----- |
| Content Creators | Need to take records of contents frequently and need to collect inspirations from different media types |
| Users who prefer visual memory aids | Need the aids with images, videos or music in journals to better memorize |
| Film Critics | Need movie clips or images to help sort the reviews |

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/knovvX/TECHIN510_Client_Project.git
cd TECHIN510_Client_Project
```

2. Create and activate virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the MCP:
```bash
npx figma-developer-mcp --figma-api-key=figd_7bIA9LuNAgAxdqVGBjqk_bF4fYRQCm3skEgTK9uw
```

5. Run the Webpage
Simply open the index.html

## 📁 Project Structure

```
TECHIN510_Client_Project/
├── pages/
│   └── 1_Media_and_Mood.py    # Main application page
├── .gitignore                 # Git ignore rules
├── requirements.txt           # Project dependencies
└── README.md                 # Project documentation
```

## 💡 Usage Guide

1. **Media Upload**:
   - Supports PNG, JPG, JPEG images
   - Supports MP4 videos
   - Supports MP3 audio files
   - Add descriptions to each media file
   - File size limit: 200MB

2. **Mood Recording**:
   - Choose from 6 different mood states
   - Add journal entries
   - View history

3. **Data Storage**:
   - All data stored locally in SQLite database
   - Automatic saving
   - Persistent storage

## ⏰ Development Timeline

| Task | Start Date / End Date |
| ---- | -------------------- |
| Design pages and basic layout | 4.7 / 4.14 |
| Implement static layout and moodboard | 4.15 / 4.21 |
| Build database for user management | 4.22 / 4.28 |
| Enable media upload | 4.29 / 5.3 |
| Embed chatbot | 5.4 / 5.10 |
| Final polish and documentation | 5.11 / 5.13 |

## 👥 Team

- Developer: Chenghao Wang ([@wch1007](https://github.com/wch1007))
- Client: Diyun Lu ([@knovvX](https://github.com/knovvX))

## 📞 Contact Information

Feel free to reach out if you have any questions or suggestions:

- **Developer Contact**:
  - Email: wch1007@uw.edu
  - WeChat: wch18501284401
  - Instagram: caelen_wang
  - GitHub: [@wch1007](https://github.com/wch1007)

- **Project Links**:
  - Repository: [TECHIN510_Client_Project](https://github.com/knovvX/TECHIN510_Client_Project)
  - Issues: [GitHub Issues](https://github.com/knovvX/TECHIN510_Client_Project/issues)

- **University**: University of Washington
- **Course**: TECHIN510 25 Spring

## 🤝 Contributing

Issues and Pull Requests are welcome to help improve the project!

## 📄 License

MIT License

