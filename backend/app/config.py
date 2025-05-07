import os
from dotenv import load_dotenv

load_dotenv()
class Config:
    # LLM configuration
    LLM_API_KEY = os.getenv("LLM_API_KEY")  # Set your LLM API key
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Redis configuration
    REDIS_HOST = os.getenv("REDIS_HOST")  # Default to localhost if not set
    REDIS_PORT = os.getenv("REDIS_PORT")  # Default Redis port
    REDIS_USERNAME = os.getenv("REDIS_USERNAME")  # Default Redis username
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")  # Default Redis password
    
    # Class name for Manim code generation
    CLASS_NAME = os.getenv("CLASS_NAME")  # Default class name for Manim code generation
    
    # Manim settings (e.g., path to Manim executable)
    MANIM_PATH = "/usr/local/bin/manim"  # Adjust path to your system
    VIDEO_OUTPUT_PATH = "static/output.mp4"

    # AI21 Api key
    AI21_API_KEY = os.getenv("AI21_API_KEY")  # Set your AI21 API key