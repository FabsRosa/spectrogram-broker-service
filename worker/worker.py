from config import redis_client, TASK_QUEUE
from services import process_task

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