import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
import os
def converter(arquivo_entrada: str, pasta_saida: str):
    os.makedirs(pasta_saida, exist_ok=True)
    
    y, sr = librosa.load(arquivo_entrada, sr=None)
    D = librosa.stft(y)
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)
    
    plt.figure(figsize=(10, 6))
    librosa.display.specshow(
        S_db,
        sr=sr,
        x_axis="time",
        y_axis="hz",
        cmap="magma"
    )
    plt.colorbar(format="%+2.f dB")
    plt.title(f"Espectrograma - {os.path.basename(arquivo_entrada)}")
    plt.tight_layout()
    
    nome_saida = os.path.splitext(os.path.basename(arquivo_entrada))[0] + ".png"
    caminho_saida = os.path.join(pasta_saida, nome_saida)
    plt.savefig(caminho_saida)
    plt.close()
    
    print(f"Salvo em: {caminho_saida}")
