from flask import Flask
from flask_cors import CORS
import redis

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuração do Redis
    app.redis_client = redis.Redis(host='redis', port=6379, db=0)
    
    from .routes import main
    app.register_blueprint(main)
    
    return app