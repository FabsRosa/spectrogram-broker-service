import os
import uuid
import json
import redis
from flask import Flask, request, jsonify
from flask_cors import CORS  # Para evitar problemas de CORS com o frontend

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas

# Configuração do Redis
redis_host = os.environ.get('REDIS_HOST', 'redis-server')
redis_port = int(os.environ.get('REDIS_PORT', 6379))
redis_db = int(os.environ.get('REDIS_DB', 0))
redis_client = redis.Redis(host=redis_host, port=redis_port, db=redis_db)

# Nome da fila no Redis
TASK_QUEUE = 'audio_queue'

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

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)