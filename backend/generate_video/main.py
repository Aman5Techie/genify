import os
import time
import shutil
import subprocess
from uuid import uuid4
from utils.helpers import create_temporary_file
from utils.helpers import delete_media_asset
from utils.helpers import get_video_file_path
from utils.helpers import AzureBlobClient
from logger.logging import custom_logger

_CURR_WORKING_DIR = os.path.dirname(os.path.abspath(__file__))


def store_video_to_azure_storage(file_path: str):
    # create an instance of the AzureBlobClient
    try:
        custom_logger.info("Uploading to azure blob storage")
        azure_client = AzureBlobClient()
        
        custom_logger.info(f"Uploading file to Azure Blob Storage: {file_path}")
        uploaded_file = azure_client.upload_file(file_path)
        
        if uploaded_file:
            url = azure_client.get_url(uploaded_file)
            custom_logger.info(f"File uploaded successfully: {url}")
            return url
        else:
            custom_logger.error("File upload failed.")
            raise Exception("File upload failed.")    

    except Exception as err:
        custom_logger.error(f"An error occurred in AzureBlobClient: {err}")
        raise err
    



def video_maker_handler(code: str , class_name: str = "GenerateFromUser") -> str:
    
    custom_logger.info("Video maker handler")
    
    folder_path = os.path.join(_CURR_WORKING_DIR,"files") # Where python file is created
    down = os.path.join(_CURR_WORKING_DIR,"videos") 
    folder_name = f"{uuid4().hex}"
    python_file_name = f"{folder_name}.py"
    
    custom_logger.info(f"Creating temporary file: {python_file_name} in {folder_path}")
    azure_video_url = None
    

    with create_temporary_file(folder_path, python_file_name) as temp_file_path:
        with open(temp_file_path, 'w') as temp_file:
            temp_file.write(code)
        
        custom_logger.info(f"Temporary file created: {temp_file_path}")
        # Generate the video using the temporary file
        success = generate_video(temp_file_path, class_name)
        
        if success != 0:
            custom_logger.error("Video generation failed.")
            raise Exception("Video generation failed.")
        # Copy video and delete
        
        video_path = get_video_file_path(folder_name, class_name)
        custom_logger.info(f"Video generation succeeded. Video path: {temp_file_path}")
        
        # Store video to azure blob storage 
        custom_logger.info(f"Storing video to Azure Blob Storage: {video_path}")
        azure_video_url = store_video_to_azure_storage(video_path)
        
        shutil.copy(video_path, down) # change this method to upload to azure blob storage
        
        custom_logger.info(f"Video copied to: {down}")
        delete_media_asset(folder_name)
        
        custom_logger.info(f"Temporary file deleted: {temp_file_path}")

    
    custom_logger.info(f"Video URL: {azure_video_url}")        
    return azure_video_url

def generate_video(file_path: str, class_name: str = "GenerateFromUser")-> int:
    """
    Generates a video.
    
    Args:
        file_path (str): file path
    """
    custom_logger.info(f"Generating video from file: {file_path}")
    try:
        cmd = ["uv", "run", "manim", str(file_path), class_name]
     
        custom_logger.info(f"Command to run: {cmd}")
        result = subprocess.run(cmd, cwd=_CURR_WORKING_DIR, capture_output=True, text=True)

        if result.returncode != 0:
            print("Manim error:", result.stderr)
            custom_logger.error(f"Manim error: {result.stderr}")
            return -1  # Indicate failure
            
        else:
            print("Manim output:", result.stdout)
            custom_logger.info(f"Manim output: {result.stdout}")
            return 0  # Indicate success
    
    
    except Exception as e:
        print(f"An error occurred: {e}")
        custom_logger.error(f"An error occurred: {e}")
        raise e
