from flask import Blueprint, request, jsonify
from app.services.job_service import create_job
from logger.logging import custom_logger
generate_code_bp = Blueprint('generate_code', __name__)

@generate_code_bp.route('/submit_prompt', methods=['POST'])
def submit_prompt():
    
    prompt = request.json.get('prompt' ,None)
    request_id = request.json.get('request_id' ,None)
    custom_logger.info(f"Received prompt: {prompt} -> request_id: {request_id}")
    
    if prompt is None:
        return jsonify({"error": "No prompt provided"}), 400
    
    job_id = create_job(prompt, request_id)
    
    return jsonify({"job_id": job_id}), 202
