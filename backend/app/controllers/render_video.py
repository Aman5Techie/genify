# /backend/app/controllers/render_video.py

from flask import Blueprint, jsonify, request
from app.services.job_service import get_job_status

render_video_bp = Blueprint('render_video', __name__)


@render_video_bp.route('/job_status', methods=['GET'])
def job_status():

    job_id = request.args.get('job_id')
    
    if not job_id:
        return jsonify({"error": "Job ID is required"}), 400
    status, video_url = get_job_status(job_id)
    
    if status == "not_found":
        return jsonify({"error": "Job not found"}), 404
    
    return jsonify({"status": status, "video_url": video_url})
    