import io
import base64
import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt
from scipy.io.wavfile import write  # Para salvar o .wav

def audio_base64_to_spectrogram_png(audio_base64: str, wav_path: str = "temp_audio.wav", output_path: str = "spectrogram.png") -> str:
    """
    -> recebe um áudio em base64
    -> salva como .wav
    ->gera o espectrograma e salva como PNG.
    Retorna o caminho da imagem gerada.
    nova funçao : que transforma a img em base 64 tbm ><
    """
    # --- 1. Decodifica o base64 e salva como WAV ---
    audio_bytes = base64.b64decode(audio_base64)
    with open(wav_path, "wb") as f:
        f.write(audio_bytes)

    # --- 2. Carrega o áudio salvo ---
    y, sr = librosa.load(wav_path, sr=None)

    # --- 3. Gera espectrograma em dB ---
    S = librosa.stft(y)
    S_db = librosa.amplitude_to_db(np.abs(S), ref=np.max)

    # --- 4. Cria figura matplotlib ---
    fig, ax = plt.subplots(figsize=(6, 4))
    img = librosa.display.specshow(S_db, sr=sr, x_axis='time', y_axis='log', ax=ax, cmap="magma")
    ax.set_title("Espectrograma")
    fig.colorbar(img, ax=ax, format="%+2.0f dB")

    # --- 5. Salva como PNG ---
    plt.savefig(output_path, format="png")
    plt.close(fig)

    return output_path

def audio_base64_to_spectrogram_base64(audio_base64: str, wav_path: str = "temp_audio.wav", output_path: str = "spectrogram.png") -> str:
    """
    Recebe áudio em base64
    gera espectrograma e
    retorna o base64 da imagem PNG.
    """
    audio_bytes = base64.b64decode(audio_base64)  #decodifica o base64 e salva como WAV
    with open(wav_path, "wb") as f:
        f.write(audio_bytes)
    y, sr = librosa.load(wav_path, sr=None)
    S = librosa.stft(y)
    S_db = librosa.amplitude_to_db(np.abs(S), ref=np.max)
    fig, ax = plt.subplots(figsize=(6, 4))
    img = librosa.display.specshow(S_db, sr=sr, x_axis='time', y_axis='log', ax=ax, cmap="magma")
    ax.set_title("Espectrograma")
    fig.colorbar(img, ax=ax, format="%+2.0f dB")
    plt.savefig(output_path, format="png")
    plt.close(fig)
    with open(output_path, "rb") as img_file:
        img_bytes = img_file.read()
        img_base64 = base64.b64encode(img_bytes).decode("utf-8")
    return img_base64