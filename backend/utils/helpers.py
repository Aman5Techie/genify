import os
import re
from uuid import uuid4
from contextlib import contextmanager
import shutil
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from logger.logging import custom_logger
from azure.storage.blob import (
    BlobServiceClient,
    generate_blob_sas,
    BlobSasPermissions,
)

load_dotenv()
_MEDIA_DIR = os.path.join(os.getcwd(), "generate_video")

@contextmanager
def create_temporary_file(folder_path:str, file_name:str):
    custom_logger.info(f"Creating temporary file: {file_name} in {folder_path}")
    try:
        full_path = os.path.join(folder_path, file_name)
        
        with open(full_path, 'w') as f:
            f.write("# Temporary file created for video rendering.\n") 

        custom_logger.info(f"Temporary file created: {full_path}")
        yield full_path
    except Exception as e:
        custom_logger.error(f"Error creating temporary file: {e}")
        raise e
    finally:
        if os.path.exists(full_path):
            custom_logger.info(f"Removing temporary file: {full_path}")
                    
            is_local = os.getenv("IS_LOCAL", "False")  # Default to "False" if not set
    
            if is_local == "True":
                custom_logger.info(f"Code written to {full_path}")
            else:
                os.remove(full_path)
                custom_logger.info(f"Temporary file removed: {full_path}")
            

def get_video_file_path(folder_name: str, class_name: str) -> str:
    """
    Get the full path of the video file.
    
    Args:
        file_name (str): The name of the video file.
        
    Returns:
        str: The full path of the video file.
    """
    
    custom_logger.info(f"Getting video file path for {folder_name} and {class_name}")
    video_path = os.path.join(_MEDIA_DIR,"media","videos",folder_name,"1080p60",f"{class_name}.mp4")
    
    if not os.path.exists(video_path):
        custom_logger.error(f"Video file not found: {video_path}")
        raise FileNotFoundError(f"Video file not found: {video_path}")
    
    custom_logger.info(f"Video file path: {video_path}")
    return video_path


def delete_media_asset(folder_name: str) -> None:
    """
    Delete the media asset (video file).
    
    Args:
        file_name (str): The name of the video file.
        class_name (str): The name of the class used in the video.
    """
    video_folder_path = os.path.join(_MEDIA_DIR,"media","videos", folder_name)
    image_folder_path = os.path.join(_MEDIA_DIR,"media","images", folder_name)
    
    custom_logger.info(f"Deleting media asset: {video_folder_path} and {image_folder_path}")
        
    if os.path.exists(video_folder_path) and os.path.isdir(video_folder_path):
        shutil.rmtree(video_folder_path)
        custom_logger.info(f"Removed folder: {video_folder_path}")
    else:
        custom_logger.info(f"Folder does not exist: {video_folder_path}")
        
    if os.path.exists(image_folder_path) and os.path.isdir(image_folder_path):
        shutil.rmtree(image_folder_path)
        custom_logger.info(f"Removed folder: {image_folder_path}")
    else:
        custom_logger.info(f"Folder does not exist: {image_folder_path}")
        
        
class AzureBlobClient:
    def __init__(self, container_name: str|None = None):
        # Use environment variable or fallback hardcoded string (not recommended)
        custom_logger.info("Connecting to Azure Blob Storage...")
        self.connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING") or "DefaultEndpointsProtocol=...<your-connection-string>..."
        self.container_name = container_name or os.getenv("AZURE_CONTAINER_NAME")
        self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        
        # Get account name and key for SAS token
        self.account_name = self.blob_service_client.account_name
        self.account_key = self.blob_service_client.credential.account_key
        
        custom_logger.info(f"Connected to Azure Blob Storage: {self.account_name}/{self.container_name}")

    def upload_file(self, file_path: str) -> str:
        try:
            custom_logger.info(f"Uploading file to Azure Blob Storage: {file_path}")
            file_name = os.path.basename(file_path)
            # Adding a unique id to the file name
            
            unique_id = uuid4().hex
            file_name = f"{unique_id}_{file_name}"
            
            # Upload the file to Azure Blob Storage
            blob_client = self.blob_service_client.get_blob_client(container=self.container_name, blob=file_name)

            with open(file_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True)

            custom_logger.info(f"✅ Uploaded file: {file_name} to Azure Blob Storage")
            return file_name

        except Exception as e:
            custom_logger.error(f"Upload failed: {e}")
            return ""

    def get_url(self, file_name: str, expiry_days: int = 365) -> str:
        try:
            
            expiry_time = datetime.now(timezone.utc) + timedelta(days=expiry_days) # 1 year expiry time
            sas_token = generate_blob_sas(
                account_name=self.account_name,
                container_name=self.container_name,
                blob_name=file_name,
                account_key=self.account_key,
                permission=BlobSasPermissions(read=True),
                expiry=expiry_time
            )

            url = f"https://{self.account_name}.blob.core.windows.net/{self.container_name}/{file_name}?{sas_token}"
            custom_logger.info(f"Generated URL: {url}")
            return url

        except Exception as e:
            print(f"❌ URL generation failed: {e}")
            custom_logger.error(f"URL generation failed: {e}")
            return ""

def extract_class_name(code: str) -> str:
    """
    Extract the class name from a Manim scene code string.

    Args:
        code (str): Python code as a string

    Returns:
        str: Class name if found, else None
    """
    match = re.search(r'class\s+(\w+)\s*\(.*?\):', code)
    
    if match:
        return match.group(1)
    
    return "GenerateFromUser"  # Default class name if not found
