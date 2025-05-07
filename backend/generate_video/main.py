import shutil
import time
from uuid import uuid4
from utils.helpers import create_temporary_file
from utils.helpers import delete_media_asset
from utils.helpers import get_video_file_path
from utils.helpers import AzureBlobClient

import subprocess
import os

_CURR_WORKING_DIR = os.path.dirname(os.path.abspath(__file__))



def store_video_to_azure_storage(file_path: str):
    # create an instance of the AzureBlobClient
    try:
        print("Uploading to azure blob storage")
        azure_client = AzureBlobClient()
        
        print("upoading")
        uploaded_file = azure_client.upload_file(file_path)
        
        if uploaded_file:
            url = azure_client.get_url(uploaded_file)
            print(f"🔗 Access your file here:\n{url}")
            return url
        else:
            raise Exception("File upload failed.")    

    except Exception as err:
        print(f"An error occurred in AzureBlobClient: {err}")
        raise err
    



def video_maker_handler(code: str , class_name: str = "GenerateFromUser"):
    
    print("Video maker handler")
    folder_path = os.path.join(_CURR_WORKING_DIR,"files") # Where python file is created
    down = os.path.join(_CURR_WORKING_DIR,"videos") 
    folder_name = f"{uuid4().hex}"
    python_file_name = f"{folder_name}.py"
    

    with create_temporary_file(folder_path, python_file_name) as temp_file_path:
        with open(temp_file_path, 'w') as temp_file:
            temp_file.write(code)
        
        # Generate the video using the temporary file
        generate_video(temp_file_path, class_name)
        
        # Copy video and delete
        
        time.sleep(10)
        video_path = get_video_file_path(folder_name, class_name)
        
        # Store video to azure blob storage 
        print("Storing video to azure blob storage")
        store_video_to_azure_storage(video_path)
        
        shutil.copy(video_path, down) # change this method to upload to azure blob storage
        time.sleep(10)
        
        print("done")
        
        delete_media_asset(folder_name)

        print("2done")

def generate_video(file_path: str, class_name: str = "GenerateFromUser"):
    """
    Generates a video.
    
    Args:
        file_path (str): file path
    """
    
    try:
        cmd = ["uv", "run", "manim", str(file_path), class_name]
        print(cmd)
        result = subprocess.run(cmd, cwd=_CURR_WORKING_DIR, capture_output=True, text=True)

        if result.returncode != 0:
            print("Manim error:", result.stderr)
        else:
            print("Manim output:", result.stdout)
    
    
    except Exception as e:
        print(f"An error occurred: {e}")
        raise e
      
code = """
from manim import *

class RedisCacheFlow(Scene):
    def construct(self):
        # Boxes
        user_query = Rectangle(width=3, height=1, color=BLUE).shift(LEFT * 5)
        user_text = Text("User Query", font_size=24).move_to(user_query)

        redis_cache = Rectangle(width=3, height=1, color=ORANGE)
        redis_text = Text("Redis Cache", font_size=24).move_to(redis_cache)

        db_query = Rectangle(width=3.5, height=1, color=GREEN).shift(RIGHT * 5)
        db_text = Text("Database Query", font_size=24).move_to(db_query)

        self.play(FadeIn(user_query), Write(user_text))
        self.play(FadeIn(redis_cache), Write(redis_text))
        self.play(FadeIn(db_query), Write(db_text))

        # Arrow from User to Redis
        arrow1 = Arrow(user_query.get_right(), redis_cache.get_left(), buff=0.1)
        self.play(GrowArrow(arrow1))

        # Simulate cloud using ellipse with text
        no_data_cloud = Ellipse(width=4, height=1.5, color=GRAY).next_to(redis_cache, UP)
        no_data_text = Text("No data in cache", font_size=20).move_to(no_data_cloud)
        self.play(FadeIn(no_data_cloud), Write(no_data_text))

        # Red cross
        cross = Cross(redis_cache, color=RED)
        self.play(FadeIn(cross))

        # Arrow to Database
        arrow2 = Arrow(redis_cache.get_right(), db_query.get_left(), buff=0.1)
        self.play(GrowArrow(arrow2))

        # DB cloud (also ellipse)
        db_cloud = Ellipse(width=4.5, height=1.5, color=GRAY).next_to(db_query, UP)
        db_cloud_text = Text("Getting data from Database", font_size=18).move_to(db_cloud)
        self.play(FadeIn(db_cloud), Write(db_cloud_text))

        # Arrow from DB to Redis
        arrow3 = Arrow(db_query.get_left(), redis_cache.get_right(), buff=0.1)
        self.play(GrowArrow(arrow3))

        # Remove red cross and no data cloud
        self.play(FadeOut(cross), FadeOut(no_data_cloud), FadeOut(no_data_text))

        # Arrow from Redis to User
        arrow4 = Arrow(redis_cache.get_left(), user_query.get_right(), buff=0.1)
        self.play(GrowArrow(arrow4))

        self.wait(2)

"""

# Inti point
video_maker_handler(code,"RedisCacheFlow")




