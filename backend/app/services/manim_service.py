# /backend/app/services/manim_service.py

import re
import subprocess
import os
from app.config import Config


def extract_class_name(manim_code):
    """
    Extract the first class name that inherits from Scene.
    """
    match = re.search(r'class\s+(\w+)\s*\(\s*Scene\s*\)\s*:', manim_code)
    if match:
        return match.group(1)
    
    return Config.CLASS_NAME

def render_video(manim_code):
    """
    Renders a video using the Manim library based on the generated Manim code.
    The code is written to a temporary file and then passed to the Manim rendering system.
    """
    try:
        # Write Manim code to a temporary .py file
        temp_file_path = "/tmp/generated_manim_code.py"
        with open(temp_file_path, "w") as f:
            f.write(manim_code)
        
        class_name = extract_class_name(manim_code)
        # Call Manim to render the video
        render_command = [
            Config.MANIM_PATH, temp_file_path, "-o", Config.VIDEO_OUTPUT_PATH
        ]
        
        subprocess.run(render_command, check=True)
        
        # Return the path to the rendered video
        return Config.VIDEO_OUTPUT_PATH
    
    except subprocess.CalledProcessError as e:
        raise Exception(f"Error rendering video with Manim: {str(e)}")
    finally:
        # Clean up temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
