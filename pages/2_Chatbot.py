import streamlit as st
import requests

st.set_page_config(page_title="AI Chat Companion", layout="centered")
st.title("🤖 AI Chatbot Companion (Free Falcon API)")

HF_API = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"
HEADERS = {"Authorization": "Bearer YOUR_HUGGINGFACE_TOKEN"}

def query(payload):
    response = requests.post(HF_API, headers=HEADERS, json=payload)
    return response.json()

user_input = st.text_input("💬 Ask something or describe your journal:")
if st.button("Send"):
    with st.spinner("Thinking..."):
        result = query({"inputs": user_input})
        output = result[0]['generated_text'] if isinstance(result, list) else result
        st.write("🧠", output)
