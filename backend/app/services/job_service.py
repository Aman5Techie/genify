# /backend/app/services/job_service.py

import uuid
import os
import time
from app.services.llm_service import generate_code_via_ai21
from generate_video.main import video_maker_handler
from utils.helpers import extract_class_name
from logger.logging import custom_logger
# In-memory job storage for now (could be replaced with Redis for scalability)
job_storage = {}

def create_job(prompt, request_id):
    job_id = str(uuid.uuid4())
    job_storage[job_id] = {"status": "pending", "video_url": None, "data" : None}
    
    custom_logger.info(f"Job created with ID: {job_id} -> request_id: {request_id}")
    
    # Start the background job
    generate_job_code(job_id, prompt) # Make this async in the future
    
    return job_id

def update_job_data(job_id, data):
    if job_id in job_storage:
        job_storage[job_id]["data"] = data
    else:
        raise ValueError("Job ID not found")


def generate_job_code(job_id, prompt):
    try:
        # Update job status to 'in_progress'
        custom_logger.info(f"Job {job_id} is in progress")
        job_storage[job_id]["status"] = "in_progress"
        
        custom_logger.info("Sleep for 10 seconds")
  

        # Step 1: Generate Manim code using the prompt
        manim_code = generate_code_via_ai21(prompt)
        update_job_data(job_id, manim_code)
        custom_logger.info(f"Generated Manim code for success {job_id}: {manim_code}")
      
        
        # Step 2: Render the video from the Manim code
        class_name = extract_class_name(manim_code)
        
        custom_logger.info(f"Extracted class name: {class_name}")
        
        azure_video_url = video_maker_handler(manim_code, class_name)
        # Step 3: Store the video and update the job status

        custom_logger.info(f"Video URL: {azure_video_url}")
        
        job_storage[job_id]["status"] = "completed"
        job_storage[job_id]["video_url"] = azure_video_url
        
        custom_logger.info(f"Job {job_id} completed successfully")
    
    except Exception as e:
        job_storage[job_id]["status"] = "failed"
        job_storage[job_id]["video_url"] = str(e)

def get_job_status(job_id):
    print(job_storage)
    job = job_storage.get(job_id)
    if not job:
        return "not_found", None
    return job["status"], job["video_url"]
