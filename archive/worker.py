import redis
import json
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
import os

r = redis.Redis(host='localhost', port=6379, db=0)

while True:
    _, task_json = r.blpop('audio_tasks')
    task = json.loads(task_json)

    audio_path = task['file_path']
    task_id = task['task_id']

    # Gera espectrograma
    y, sr = librosa.load(audio_path)
    S = librosa.stft(y)
    S_db = librosa.amplitude_to_db(np.abs(S), ref=np.max)

    # Salva imagem
    output_dir = 'static'
    os.makedirs(output_dir, exist_ok=True)
    img_filename = f"{task_id}_espectrograma.png"
    img_path = os.path.join(output_dir, img_filename)

    plt.figure(figsize=(10, 4))
    librosa.display.specshow(S_db, sr=sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Espectrograma')
    plt.tight_layout()
    plt.savefig(img_path)
    plt.close()

    # Salva resultado no Redis
    result = {
        'img_url': f'/static/{img_filename}',
        'task_id': task_id
    }
    r.set(f'result:{task_id}', json.dumps(result))