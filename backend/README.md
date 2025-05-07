LINUX
gunicorn -w 4 -b 0.0.0.0:8000 app.main:create_app

WINDOWS
flask --app app.main run --reload


RedisCacheFlow