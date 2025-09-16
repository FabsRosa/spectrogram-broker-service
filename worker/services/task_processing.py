import json
from config import redis_client
from services.audio_processing import audio_base64_to_spectrogram_base64

def process_task(task_id):
    """
    Processa uma tarefa do Redis
    """
    # Obtém os dados da tarefa do Redis
    task_data = redis_client.get(task_id)
    if not task_data:
        print(f"Tarefa {task_id} não encontrada")
        return
    
    task_data = json.loads(task_data)
    audio_data = task_data.get('audio_data')
    if not audio_data:
        print(f"Sem dados de áudio para a tarefa {task_id}")
        return
    
    try:
        # Gera o espectrograma
        spectrogram_data = audio_base64_to_spectrogram_base64(audio_data)
        # Atualiza os dados da tarefa com o espectrograma e status
        task_data['spectrogram_data'] = spectrogram_data
        task_data['status'] = 'completed'
        # Salva de volta no Redis
        redis_client.set(task_id, json.dumps(task_data))
        print(f"Tarefa {task_id} processada com sucesso")
    except Exception as e:
        print(f"Erro ao processar a tarefa {task_id}: {e}")
        task_data['status'] = 'failed'
        redis_client.set(task_id, json.dumps(task_data))