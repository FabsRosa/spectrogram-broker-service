import socket
import os
from converter import converter

HOST = "NAOSEI"
PORT =  "TBM NSEI "
ARQ_ENTRADA = "arquivo_entrada"
ARQ_SAIDA = "arquivo_saida"

def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        print(f"[WORKER] Aguardando conexão em {HOST}:{PORT}...")

        while True:
            conn, addr = s.accept()
            with conn:
                print(f"[WORKER] Conectado a {addr}")
                data = conn.recv(1024).decode()
                if not data:
                    continue

                audio_name = data.strip()
                entrada = os.path.join(ARQ_ENTRADA, audio_name)
                try:
                    converter(entrada, ARQ_SAIDA)
                    conn.sendall(b"OK")
                except Exception as e:
                    conn.sendall(f"ERRO: {e}".encode())

if __name__ == "__main__":
    main()
