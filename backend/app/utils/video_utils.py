# /backend/app/utils/video_utils.py

import shutil
import os
from app.config import Config

def store_video(video_path):
    """
    Moves the rendered video to the `static/videos/` folder and returns its accessible URL.
    """
    try:
        # Ensure the 'videos' directory exists
        video_dir = os.path.join(os.getcwd(), 'static', 'videos')
        if not os.path.exists(video_dir):
            os.makedirs(video_dir)

        # Move the video file to the 'static/videos/' directory
        new_video_path = os.path.join(video_dir, "output.mp4")
        shutil.move(video_path, new_video_path)

        # Return the URL for the video
        return f"/static/videos/output.mp4"
    
    except Exception as e:
        raise Exception(f"Error storing the video: {str(e)}")
