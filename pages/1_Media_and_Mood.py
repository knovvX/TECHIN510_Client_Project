import streamlit as st
from datetime import datetime
import sqlite3
import os

DB_PATH = "journal.db"
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# 初始化表格
c.execute('''CREATE TABLE IF NOT EXISTS entries
             (date TEXT, mood TEXT, text TEXT)''')
c.execute('''CREATE TABLE IF NOT EXISTS media_entries
             (date TEXT, file_name TEXT, file_type TEXT, description TEXT)''')
conn.commit()


st.set_page_config(page_title="Media Upload & Moodboard", layout="wide")

st.title("🧠 Media Journal & Mood Recorder")

# ---------------------
# Mood Selection
# ---------------------
st.header("🎨 How are you feeling?")
mood = st.radio(
    "Select your mood:",
    ["😊 Happy", "😞 Sad", "😠 Frustrated", "😌 Relaxed", "😕 Confused", "🤩 Excited"],
    horizontal=True,
)

st.write(f"Today is **{datetime.now().strftime('%Y-%m-%d')}**, you're feeling: {mood}")

# ---------------------
# Column Layout
# ---------------------
col1, col2 = st.columns([1, 2])

with col1:
    st.header("📁 Upload Media")
    uploaded_file = st.file_uploader("Choose a file", type=["png", "jpg", "jpeg", "mp4", "mp3"])
    
    if uploaded_file is not None:
        file_type = uploaded_file.type
        try:
            st.success(f"{uploaded_file.name} uploaded!")
            
            # 添加媒体描述
            media_description = st.text_area("Add a description for your media:", key="media_desc")
            save_media = st.button("💾 Save Media with Description")
            
            if file_type.startswith('image'):
                try:
                    st.image(uploaded_file, use_container_width=True)
                except Exception as e:
                    st.error(f"Error displaying image: {str(e)}")
            elif file_type.startswith('audio'):
                try:
                    st.audio(uploaded_file)
                except Exception as e:
                    st.error(f"Error playing audio: {str(e)}")
            elif file_type.startswith('video'):
                try:
                    st.video(uploaded_file)
                except Exception as e:
                    st.error(f"Error playing video: {str(e)}")
            else:
                st.warning("Unsupported file type")
                
            # 保存媒体信息到数据库
            if save_media:
                c.execute("INSERT INTO media_entries VALUES (?, ?, ?, ?)",
                         (datetime.now().strftime("%Y-%m-%d %H:%M"), 
                          uploaded_file.name,
                          file_type,
                          media_description))
                conn.commit()
                st.success("✅ Media and description saved!")
                
        except Exception as e:
            st.error(f"Error processing file: {str(e)}")

with col2:
    st.header("📝 Write Your Journal")
    journal_text = st.text_area("What's on your mind today?", height=300)
    save = st.button("💾 Save Entry")
    
    if save:
        c.execute("INSERT INTO entries VALUES (?, ?, ?)",
                 (datetime.now().strftime("%Y-%m-%d %H:%M"), mood, journal_text))
        conn.commit()
        st.success("✅ Entry saved to database!")

# ---------------------
# Previous Entries
# ---------------------
st.divider()

# 显示最近的媒体条目
st.subheader("🎬 Recent Media Uploads")
media_entries = c.execute("SELECT * FROM media_entries ORDER BY date DESC LIMIT 3").fetchall()
if media_entries:
    for entry in media_entries:
        st.markdown(f"**{entry[0]}** - {entry[1]}")
        st.markdown(f"> {entry[3]}")
        st.divider()

st.subheader("📚 Previous Journal Entries")
entries = c.execute("SELECT * FROM entries ORDER BY date DESC LIMIT 5").fetchall()
for e in entries:
    st.markdown(f"**{e[0]}** | Mood: {e[1]}  \n> {e[2]}")
    st.divider()
