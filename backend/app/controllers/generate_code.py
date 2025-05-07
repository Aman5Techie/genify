from flask import Blueprint, request, jsonify
from app.services.job_service import create_job

generate_code_bp = Blueprint('generate_code', __name__)

@generate_code_bp.route('/submit_prompt', methods=['POST'])
def submit_prompt():
    prompt = request.json.get('prompt' ,None)
    
    if prompt is None:
        return jsonify({"error": "No prompt provided"}), 400
    
    job_id = create_job(prompt)
    
    return (job_id), 202
    # return jsonify({"job_id": job_id}), 202
