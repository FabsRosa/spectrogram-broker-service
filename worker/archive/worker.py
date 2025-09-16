import json
import time
import librosa
import matplotlib.pyplot as plt
import numpy as np
import base64
from io import BytesIO

def process_audio_task(redis_client, task_data):
    task_id = task_data['task_id']
    file_path = task_data['file_path']
    
    try:
        # Carregar áudio
        y, sr = librosa.load(file_path)
        
        # Gerar espectrograma
        D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
        
        # Criar imagem
        plt.figure(figsize=(10, 4))
        librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='log')
        plt.colorbar(format='%+2.0f dB')
        plt.title('Espectrograma')
        
        # Converter para base64
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        img_str = base64.b64encode(buffer.read()).decode('utf-8')
        plt.close()
        
        # Salvar resultado no Redis
        result_data = {
            'task_id': task_id,
            'spectrogram': img_str,
            'filename': task_data['filename']
        }
        
        redis_client.setex(f'result:{task_id}', 3600, json.dumps(result_data))  # Expira em 1 hora
        
        print(f"Task {task_id} processed successfully")
        
    except Exception as e:
        error_data = {
            'task_id': task_id,
            'error': str(e)
        }
        redis_client.setex(f'error:{task_id}', 3600, json.dumps(error_data))
        print(f"Error processing task {task_id}: {str(e)}")

def worker_loop(redis_client):
    print("Worker started. Waiting for tasks...")
    
    while True:
        # Buscar tarefa da fila (bloqueante)
        _, task_json = redis_client.blpop('audio_tasks', timeout=0)
        task_data = json.loads(task_json)
        
        print(f"Processing task: {task_data['task_id']}")
        process_audio_task(redis_client, task_data)