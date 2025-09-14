from flask import Blueprint, request, jsonify
import uuid
import json

main = Blueprint('main', __name__)

@main.route('/upload', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    task_id = str(uuid.uuid4())
    
    # Salvar arquivo temporariamente (em produção, usar storage adequado)
    file_path = f"/tmp/{task_id}_{audio_file.filename}"
    audio_file.save(file_path)
    
    # Adicionar tarefa à fila do Redis
    task_data = {
        'task_id': task_id,
        'file_path': file_path,
        'filename': audio_file.filename
    }
    
    request.app.redis_client.rpush('audio_tasks', json.dumps(task_data))
    
    return jsonify({'task_id': task_id, 'status': 'queued'})

@main.route('/status/<task_id>', methods=['GET'])
def get_status(task_id):
    result = request.app.redis_client.get(f'result:{task_id}')
    if result:
        return jsonify({'status': 'completed', 'result': json.loads(result)})
    
    # Verificar se ainda está na fila
    return jsonify({'status': 'processing'})