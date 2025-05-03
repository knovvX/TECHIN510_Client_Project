import streamlit as st

# 设置页面配置
st.set_page_config(
    page_title="Digital Multimedia Journal",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# 自定义 CSS
st.markdown("""
    <style>
    .main {
        background-color: #f8f9fa;
        padding: 0;
    }
    .login-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 2rem;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .stButton>button {
        width: 100%;
        border-radius: 20px;
        border: none;
        background-color: #6c5ce7;
        color: white;
        padding: 10px 24px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        background-color: #5649c0;
        transform: translateY(-2px);
    }
    .stTextInput>div>div>input {
        border-radius: 10px;
        border: 1px solid #e0e0e0;
        padding: 10px;
    }
    .title {
        text-align: center;
        color: #6c5ce7;
        font-size: 2.5rem;
        margin-bottom: 2rem;
    }
    .subtitle {
        text-align: center;
        color: #666;
        margin-bottom: 2rem;
    }
    </style>
""", unsafe_allow_html=True)

# 登录状态管理
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False

# 登录界面
if not st.session_state.logged_in:
    st.markdown('<div class="login-container">', unsafe_allow_html=True)
    
    # Logo 和标题
    st.markdown('<h1 class="title">Digital Journal</h1>', unsafe_allow_html=True)
    st.markdown('<p class="subtitle">Your Personal Multimedia Diary</p>', unsafe_allow_html=True)
    
    # 登录表单
    with st.form("login_form"):
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        submit = st.form_submit_button("Login")
        
        if submit:
            if username and password:  # 这里可以添加实际的验证逻辑
                st.session_state.logged_in = True
                st.rerun()
            else:
                st.error("Please enter both username and password")
    
    st.markdown('</div>', unsafe_allow_html=True)

# 主应用界面
else:
    # 侧边栏
    with st.sidebar:
        st.title("📔 Digital Journal")
        st.markdown("---")
        
        # 导航菜单
        page = st.radio(
            "Navigation",
            ["Home", "Upload Media", "AI Assistant", "History"],
            label_visibility="collapsed"
        )
        
        # 退出登录按钮
        if st.button("Logout"):
            st.session_state.logged_in = False
            st.rerun()

    # 主内容区
    if page == "Home":
        st.title("Welcome to Digital Journal")
        st.write("""
        This is your personal multimedia diary application.
        Navigate through the sidebar to:
        - Upload media & record your mood
        - Chat with the AI assistant
        - Review your journal history
        """)
        
    elif page == "Upload Media":
        st.title("Upload Media")
        uploaded_file = st.file_uploader("Choose a file", type=["jpg", "jpeg", "png", "mp4", "mp3"])
        if uploaded_file is not None:
            st.success("File uploaded successfully!")
            
    elif page == "AI Assistant":
        st.title("AI Assistant")
        user_input = st.text_input("Enter your question:")
        if st.button("Send"):
            st.write("AI Response: Processing your question...")
            
    elif page == "History":
        st.title("History")
        st.write("Your journal history will appear here...")
