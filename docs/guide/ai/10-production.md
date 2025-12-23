# Production AI

Deploying AI systems to production requires careful consideration of scalability, reliability, and cost. This lesson covers MLOps best practices.

## Production Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production AI System                      │
├─────────────────────────────────────────────────────────────┤
│  Client → API Gateway → Load Balancer → AI Service          │
│                              ↓                               │
│                    Model Serving Layer                       │
│                              ↓                               │
│          ┌─────────────────────────────────────┐            │
│          │  Model Registry  │  Feature Store   │            │
│          └─────────────────────────────────────┘            │
│                              ↓                               │
│          ┌─────────────────────────────────────┐            │
│          │  Monitoring  │  Logging  │  Alerts  │            │
│          └─────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Model Serving with FastAPI

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

app = FastAPI(title="AI Model API")

# Load model at startup
model = None
tokenizer = None

@app.on_event("startup")
async def load_model():
    global model, tokenizer
    model_name = "distilbert-base-uncased-finetuned-sst-2-english"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    model.eval()

class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    label: str
    confidence: float

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        # Tokenize input
        inputs = tokenizer(
            request.text,
            return_tensors="pt",
            truncation=True,
            max_length=512
        )

        # Get prediction
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=-1)
            pred_class = torch.argmax(probs, dim=-1).item()
            confidence = probs[0][pred_class].item()

        labels = ["NEGATIVE", "POSITIVE"]
        return PredictionResponse(
            label=labels[pred_class],
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Download model at build time (optional)
RUN python -c "from transformers import AutoModel, AutoTokenizer; \
    AutoTokenizer.from_pretrained('distilbert-base-uncased'); \
    AutoModel.from_pretrained('distilbert-base-uncased')"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  ai-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/models
      - LOG_LEVEL=INFO
    volumes:
      - ./models:/models
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

## Caching and Rate Limiting

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import redis
import hashlib
import json
from functools import wraps
import time

app = FastAPI()

# Redis connection
redis_client = redis.Redis(host='localhost', port=6379, db=0)

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute

    async def __call__(self, request):
        client_ip = request.client.host
        key = f"rate_limit:{client_ip}"

        current = redis_client.get(key)
        if current and int(current) >= self.requests_per_minute:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")

        pipe = redis_client.pipeline()
        pipe.incr(key)
        pipe.expire(key, 60)
        pipe.execute()

rate_limiter = RateLimiter(requests_per_minute=100)

def cache_response(ttl_seconds: int = 300):
    """Cache decorator for API responses"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Create cache key from function arguments
            cache_key = f"cache:{func.__name__}:{hashlib.md5(str(kwargs).encode()).hexdigest()}"

            # Check cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)

            # Execute function
            result = await func(*args, **kwargs)

            # Store in cache
            redis_client.setex(cache_key, ttl_seconds, json.dumps(result))

            return result
        return wrapper
    return decorator

@app.post("/predict")
@cache_response(ttl_seconds=3600)
async def predict(request: PredictionRequest, _: None = Depends(rate_limiter)):
    # Your prediction logic here
    pass
```

## Monitoring and Logging

```python
import logging
from prometheus_client import Counter, Histogram, generate_latest
from fastapi import FastAPI, Response
import time

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Prometheus metrics
REQUEST_COUNT = Counter(
    'prediction_requests_total',
    'Total prediction requests',
    ['endpoint', 'status']
)

LATENCY = Histogram(
    'prediction_latency_seconds',
    'Prediction latency in seconds',
    ['endpoint']
)

MODEL_ERRORS = Counter(
    'model_errors_total',
    'Total model errors',
    ['error_type']
)

app = FastAPI()

@app.middleware("http")
async def log_requests(request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = time.time() - start_time
    logger.info(
        f"Request: {request.method} {request.url.path} "
        f"Status: {response.status_code} "
        f"Duration: {duration:.3f}s"
    )

    # Record metrics
    LATENCY.labels(endpoint=request.url.path).observe(duration)
    REQUEST_COUNT.labels(
        endpoint=request.url.path,
        status=response.status_code
    ).inc()

    return response

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")

@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        start = time.time()
        result = model.predict(request.text)
        duration = time.time() - start

        logger.info(f"Prediction completed in {duration:.3f}s")
        return result

    except Exception as e:
        MODEL_ERRORS.labels(error_type=type(e).__name__).inc()
        logger.error(f"Prediction error: {str(e)}")
        raise
```

## Model Versioning and A/B Testing

```python
from fastapi import FastAPI, Header
import random

app = FastAPI()

# Load multiple model versions
models = {
    "v1": load_model("models/v1"),
    "v2": load_model("models/v2")
}

# A/B test configuration
AB_TEST_CONFIG = {
    "v1": 0.8,  # 80% of traffic
    "v2": 0.2   # 20% of traffic
}

def select_model_version(user_id: str = None):
    """Select model version based on A/B test config"""
    if user_id:
        # Consistent assignment for same user
        hash_val = hash(user_id) % 100
        cumulative = 0
        for version, percentage in AB_TEST_CONFIG.items():
            cumulative += percentage * 100
            if hash_val < cumulative:
                return version

    # Random assignment
    rand = random.random()
    cumulative = 0
    for version, percentage in AB_TEST_CONFIG.items():
        cumulative += percentage
        if rand < cumulative:
            return version

    return "v1"

@app.post("/predict")
async def predict(
    request: PredictionRequest,
    x_user_id: str = Header(None)
):
    # Select model version
    version = select_model_version(x_user_id)
    model = models[version]

    # Get prediction
    result = model.predict(request.text)

    return {
        "prediction": result,
        "model_version": version
    }
```

## Batch Processing

```python
from fastapi import FastAPI, BackgroundTasks
from celery import Celery
import asyncio

# Celery configuration
celery_app = Celery(
    'tasks',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/1'
)

@celery_app.task
def batch_predict(texts: list):
    """Process batch predictions"""
    results = []
    for text in texts:
        result = model.predict(text)
        results.append(result)
    return results

app = FastAPI()

@app.post("/batch_predict")
async def batch_predict_endpoint(texts: list[str]):
    """Submit batch prediction job"""
    task = batch_predict.delay(texts)
    return {"task_id": task.id}

@app.get("/batch_result/{task_id}")
async def get_batch_result(task_id: str):
    """Get batch prediction results"""
    task = batch_predict.AsyncResult(task_id)

    if task.ready():
        return {"status": "completed", "results": task.result}
    else:
        return {"status": "pending"}
```

## Cost Optimization

```python
class CostOptimizedLLM:
    """Optimize LLM costs with caching and model selection"""

    def __init__(self):
        self.client = OpenAI()
        self.cache = {}

    def get_cache_key(self, prompt, model):
        return hashlib.md5(f"{model}:{prompt}".encode()).hexdigest()

    def select_model(self, prompt):
        """Select appropriate model based on task complexity"""
        # Simple tasks use cheaper models
        if len(prompt) < 100:
            return "gpt-3.5-turbo"

        # Check for complex indicators
        complex_indicators = ["analyze", "explain in detail", "compare", "evaluate"]
        if any(ind in prompt.lower() for ind in complex_indicators):
            return "gpt-4"

        return "gpt-3.5-turbo"

    def generate(self, prompt, use_cache=True):
        model = self.select_model(prompt)
        cache_key = self.get_cache_key(prompt, model)

        # Check cache
        if use_cache and cache_key in self.cache:
            return self.cache[cache_key]

        # Generate response
        response = self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500  # Limit tokens
        )

        result = response.choices[0].message.content

        # Cache response
        self.cache[cache_key] = result

        return result
```

## Error Handling and Fallbacks

```python
from tenacity import retry, stop_after_attempt, wait_exponential

class RobustAIService:
    def __init__(self):
        self.primary_model = "gpt-4"
        self.fallback_model = "gpt-3.5-turbo"

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def predict_with_retry(self, prompt, model):
        """Prediction with automatic retry"""
        response = self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

    async def predict(self, prompt):
        """Predict with fallback"""
        try:
            return await self.predict_with_retry(prompt, self.primary_model)
        except Exception as e:
            logger.warning(f"Primary model failed: {e}, using fallback")
            try:
                return await self.predict_with_retry(prompt, self.fallback_model)
            except Exception as e:
                logger.error(f"All models failed: {e}")
                return self.get_cached_response(prompt)

    def get_cached_response(self, prompt):
        """Return cached or default response"""
        # Check for similar cached responses
        # Or return a safe default
        return "I'm unable to process your request at the moment."
```

## Security Best Practices

```python
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import APIKeyHeader
import re

app = FastAPI()

API_KEY_HEADER = APIKeyHeader(name="X-API-Key")

async def verify_api_key(api_key: str = Security(API_KEY_HEADER)):
    """Verify API key"""
    valid_keys = {"key1", "key2"}  # Load from secure storage
    if api_key not in valid_keys:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

def sanitize_input(text: str) -> str:
    """Sanitize user input"""
    # Remove potential injection patterns
    text = re.sub(r'[<>{}]', '', text)

    # Limit length
    if len(text) > 10000:
        text = text[:10000]

    return text

def validate_output(response: str) -> str:
    """Validate model output"""
    # Check for sensitive information leakage
    sensitive_patterns = [
        r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
        r'\b\d{16}\b',             # Credit card
    ]

    for pattern in sensitive_patterns:
        if re.search(pattern, response):
            return "[Output filtered for security]"

    return response

@app.post("/predict")
async def predict(
    request: PredictionRequest,
    api_key: str = Depends(verify_api_key)
):
    # Sanitize input
    clean_input = sanitize_input(request.text)

    # Get prediction
    response = model.predict(clean_input)

    # Validate output
    safe_response = validate_output(response)

    return {"prediction": safe_response}
```

## Summary

| Area | Best Practice |
|------|---------------|
| Serving | Use FastAPI + async, container deployment |
| Scaling | Load balancing, horizontal scaling |
| Caching | Redis for response caching |
| Monitoring | Prometheus metrics, structured logging |
| Cost | Model selection, caching, batching |
| Security | Input validation, output filtering, API keys |
| Reliability | Retries, fallbacks, circuit breakers |

## Production Checklist

- [ ] Model versioning and registry
- [ ] API rate limiting
- [ ] Response caching
- [ ] Comprehensive logging
- [ ] Metrics and monitoring
- [ ] Health checks
- [ ] Error handling and fallbacks
- [ ] Security measures
- [ ] Load testing
- [ ] Documentation

## Exercises

1. Deploy a model API with Docker
2. Implement caching and rate limiting
3. Set up monitoring with Prometheus
4. Create an A/B testing system

---

Congratulations! You've completed the AI & Machine Learning tutorial. Continue exploring and building amazing AI applications!

[Back to AI Tutorial Home →](/guide/ai/)
