FROM python:3.9-slim

# Instala dependências system para audio processing
RUN apt-get update && apt-get install -y libsndfile1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "worker.py"]