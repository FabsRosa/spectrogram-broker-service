import socket
import os

ARQ_ENTRADA = "arquivo_entrada"
WORKERS = [
    ("192.168.0.101", 5000),  # Worker 1
    ("192.168.0.102", 5000),  # Worker 2
    ("192.168.0.103", 5000),  # Worker 3
]

def send_task(worker_host, worker_port, audio_file):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((worker_host, worker_port))
        s.sendall(audio_file.encode())
        response = s.recv(1024).decode()
        print(f"[BROKER] Resposta de {worker_host}: {response}")

def main():
    files = [f for f in os.listdir(ARQ_ENTRADA) if f.endswith(".wav")]

    for i, audio_file in enumerate(files):
        worker = WORKERS[i % len(WORKERS)]  # round-robin
        print(f"[BROKER] Enviando {audio_file} -> {worker[0]}")
        send_task(worker[0], worker[1], audio_file)

if __name__ == "__main__":
    main()
