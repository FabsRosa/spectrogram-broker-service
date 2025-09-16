# app.py
import os
from flask import Flask
from flask_cors import CORS
from routes.health_routes import init_health_routes
from routes.audio_routes import init_audio_routes

def create_app():
    """Factory function para criar a aplicação Flask"""
    app = Flask(__name__)
    CORS(app)
    
    # Rotas
    init_health_routes(app)
    init_audio_routes(app)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)