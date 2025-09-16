import redis
from config import REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PASSWORD

def create_redis_client():
    """Cria e retorna uma instância do cliente Redis"""
    if REDIS_PASSWORD:
        return redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            password=REDIS_PASSWORD,
            decode_responses=True
        )
    else:
        return redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            decode_responses=True
        )

# Instância global do cliente Redis
redis_client = create_redis_client()