# /backend/app/main.py

import os
from dotenv import load_dotenv
from flask import Flask
from app.controllers.generate_code import generate_code_bp
from app.controllers.render_video import render_video_bp
from logger.logging import custom_logger

load_dotenv()
def create_app():
    custom_logger.info("Creating Flask app...")
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    # Register Blueprints
    app.register_blueprint(generate_code_bp, url_prefix="/api")
    app.register_blueprint(render_video_bp, url_prefix="/api")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

