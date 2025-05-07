# /backend/app/services/job_service.py

import uuid
import os
import time
from app.services.llm_service import generate_manim_code
from app.services.manim_service import render_video
from app.utils.video_utils import store_video
from app.config import Config

# In-memory job storage for now (could be replaced with Redis for scalability)
job_storage = {}

def create_job(prompt):
    job_id = str(uuid.uuid4())
    job_storage[job_id] = {"status": "pending", "video_url": None, "data" : None}

    # Start the background job
    generate_job_code(job_id, prompt) # Make this async in the future
    
    return job_id

def update_job_data(job_id, data):
    if job_id in job_storage:
        job_storage[job_id]["data"] = val
    else:
        raise ValueError("Job ID not found")


def generate_job_code(job_id, prompt):
    try:
        # Update job status to 'in_progress'
        job_storage[job_id]["status"] = "in_progress"
        time.sleep(10)

        # Step 1: Generate Manim code using the prompt
        manim_code = generate_manim_code(prompt)
        update_job_data(job_id, manim_code)
        
        print("Generated Manim code:")
        print(manim_code)
        
        time.sleep(10)        
        
        # Step 2: Render the video from the Manim code
        video_path = render_video(manim_code)

        # Step 3: Store the video and update the job status
        # video_url = store_video(video_path)
        
        job_storage[job_id]["status"] = "completed"
        job_storage[job_id]["video_url"] = video_url
    
    except Exception as e:
        job_storage[job_id]["status"] = "failed"
        job_storage[job_id]["video_url"] = str(e)

def get_job_status(job_id):
    print(job_storage)
    job = job_storage.get(job_id)
    if not job:
        return "not_found", None
    return job["status"], job["video_url"]
