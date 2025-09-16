import uuid
import json
from flask import request, jsonify
from config import TASK_QUEUE, redis_client

def init_audio_routes(app):
    """Configura as rotas relacionadas ao áudio"""
    
    @app.route('/upload', methods=['POST'])
    def upload_audio():
        data = request.get_json()
        if not data or 'audio_data' not in data:
            return jsonify({'error': 'audio_data is required'}), 400

        # Gera um ID único para a tarefa
        task_id = str(uuid.uuid4())
        audio_data = data['audio_data']

        # Armazena os dados do áudio no Redis com status pending
        task_data = {
            'audio_data': audio_data,
            'status': 'pending'
        }
        redis_client.set(task_id, json.dumps(task_data))

        # Enfileira o task_id na fila
        redis_client.lpush(TASK_QUEUE, task_id)

        return jsonify({'task_id': task_id}), 202

    @app.route('/results/<task_id>', methods=['GET'])
    def get_results(task_id):
        task_data = redis_client.get(task_id)
        if not task_data:
            return jsonify({'error': 'Task not found'}), 404

        task_data = json.loads(task_data)
        status = task_data.get('status', 'pending')

        if status == 'completed':
            spectrogram_data = task_data.get('spectrogram_data')
            return jsonify({'status': 'completed', 'spectrogram_data': spectrogram_data})
        else:
            return jsonify({'status': 'pending'})