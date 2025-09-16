from flask import jsonify
from config import redis_client

def init_health_routes(app):
    """Configura as rotas de health check"""
    @app.route('/health', methods=['GET'])
    def health_check():
        # Verifica se consegue se comunicar com o Redis
        try:
            redis_client.ping()
            return jsonify({'status': 'healthy', 'redis': 'connected'})
        except Exception as e:
            return jsonify({'status': 'unhealthy', 'redis': 'disconnected', 'error': str(e)}), 500