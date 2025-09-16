import json
import base64
import io
import redis
import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas

# Configuração do Redis
redis_host = 'redis-server'  # Nome do serviço Redis na rede Docker
redis_port = 6379
redis_db = 0
redis_client = redis.Redis(host=redis_host, port=redis_port, db=redis_db)

# Nome da fila no Redis
TASK_QUEUE = 'audio_queue'

def process_task(task_id):
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
        spectrogram_data = FUNCAO_DE_CONVERSAO_AQUI(audio_data)
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

def main():
    print("Worker iniciado. Aguardando tarefas...")
    while True:
        # Pop bloqueante da fila (espera até que uma tarefa esteja disponível)
        task_id = redis_client.brpop(TASK_QUEUE, timeout=0)[1]
        task_id = task_id.decode('utf-8')
        print(f"Processando tarefa: {task_id}")
        process_task(task_id)

if __name__ == '__main__':
    main()