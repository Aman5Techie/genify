import os
from uuid import uuid4
from contextlib import contextmanager
import shutil
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from azure.storage.blob import (
    BlobServiceClient,
    generate_blob_sas,
    BlobSasPermissions,
)

load_dotenv()
_MEDIA_DIR = os.path.join(os.getcwd(), "generate_video")

@contextmanager
def create_temporary_file(folder_path:str, file_name:str):
    try:
        full_path = os.path.join(folder_path, file_name)
        
        with open(full_path, 'w') as f:
            f.write("# Temporary file created for video rendering.\n") 

        yield full_path
        
    finally:
        if os.path.exists(full_path):
            os.remove(full_path)
            

def get_video_file_path(folder_name: str, class_name: str) -> str:
    """
    Get the full path of the video file.
    
    Args:
        file_name (str): The name of the video file.
        
    Returns:
        str: The full path of the video file.
    """
    
    video_path = os.path.join(_MEDIA_DIR,"media","videos",folder_name,"1080p60",f"{class_name}.mp4")
    
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")
    
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
        
    if os.path.exists(video_folder_path) and os.path.isdir(video_folder_path):
        shutil.rmtree(video_folder_path)
        print(f"Removed folder: {video_folder_path}")
    else:
        print(f"Folder does not exist: {video_folder_path}")
        
    if os.path.exists(image_folder_path) and os.path.isdir(image_folder_path):
        shutil.rmtree(image_folder_path)
        print(f"Removed folder: {image_folder_path}")
    else:
        print(f"Folder does not exist: {image_folder_path}")
        
        
class AzureBlobClient:
    def __init__(self, container_name: str|None = None):
        # Use environment variable or fallback hardcoded string (not recommended)
        print("Connecting to Azure Blob Storage...")
        self.connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING") or "DefaultEndpointsProtocol=...<your-connection-string>..."
        self.container_name = container_name or os.getenv("AZURE_CONTAINER_NAME")
        self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        
        # Get account name and key for SAS token
        self.account_name = self.blob_service_client.account_name
        self.account_key = self.blob_service_client.credential.account_key
        
        print(f"✅ Connected to Azure Blob Storage: {self.account_name}/{self.container_name}")

    def upload_file(self, file_path: str) -> str:
        try:
            file_name = os.path.basename(file_path)
            # Adding a unique id to the file name
            
            unique_id = uuid4().hex
            file_name = f"{unique_id}_{file_name}"
            
            # Upload the file to Azure Blob Storage
            blob_client = self.blob_service_client.get_blob_client(container=self.container_name, blob=file_name)

            with open(file_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True)

            print(f"✅ Uploaded: {file_name}")
            return file_name

        except Exception as e:
            print(f"❌ Upload failed: {e}")
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
            return url

        except Exception as e:
            print(f"❌ URL generation failed: {e}")
            return ""






# # USAGE EXAMPLE


# file_path = r"D:\C Drive Data\Desktop\prompt to video\project\backend\generate_video\videos\GenerateFromUser.mp4"

# print("Uploading file to Azure...")
# print(file_path)
# # upload_file_to_azure(file_path)

# # print(os.getenv("AZURE_CONNECTION_STRING"))
# azure_client = AzureBlobClient()

# # Upload file
# uploaded_file = azure_client.upload_file(file_path)

# # Get URL (valid for 1 hour)
# if uploaded_file:
#     url = azure_client.get_url(uploaded_file)
#     print(f"🔗 Access your file here:\n{url}")