# AI & Machine Learning Tutorial

::: info Official Resources
For more in-depth learning, visit: [OpenAI Documentation](https://platform.openai.com/docs), [Hugging Face](https://huggingface.co/docs), and [TensorFlow](https://www.tensorflow.org/learn)
:::

Welcome to the comprehensive AI & Machine Learning tutorial! Learn how to build intelligent applications using modern AI tools and frameworks.

## What is AI?

Artificial Intelligence (AI) is the simulation of human intelligence in machines. Machine Learning (ML) is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.

```python
# A simple example using OpenAI API
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Hello, AI!"}
    ]
)

print(response.choices[0].message.content)
```

## Why Learn AI?

| Feature | Description |
|---------|-------------|
| High Demand | AI skills are among the most sought-after in tech |
| Transformative | AI is reshaping every industry |
| Accessible | Modern tools make AI development easier than ever |
| Creative | Build intelligent, innovative applications |
| Future-Proof | AI will only become more important over time |
| Well-Paid | AI engineers command premium salaries |

## Tutorial Structure

### Beginner Level
- [Introduction to AI](/guide/ai/01-introduction) - What is AI, History, Types of AI
- [Machine Learning Basics](/guide/ai/02-ml-basics) - Supervised, Unsupervised, Reinforcement Learning
- [Python for AI](/guide/ai/03-python-for-ai) - Essential Python Libraries (NumPy, Pandas)
- [Your First ML Model](/guide/ai/04-first-model) - Building a Simple Classifier

### Intermediate Level
- [Neural Networks](/guide/ai/05-neural-networks) - Perceptrons, Layers, Activation Functions
- [Deep Learning](/guide/ai/06-deep-learning) - CNNs, RNNs, Transformers
- [Working with LLMs](/guide/ai/07-llms) - OpenAI API, Prompt Engineering, RAG

### Advanced Level
- [Fine-tuning Models](/guide/ai/08-fine-tuning) - Transfer Learning, Custom Training
- [AI Agents](/guide/ai/09-agents) - Building Autonomous AI Systems
- [Production AI](/guide/ai/10-production) - Deployment, Scaling, MLOps

## Prerequisites

Before starting this tutorial, you should have:

- **Python** (v3.9 or higher) installed
- Basic understanding of **programming concepts**
- Familiarity with **command line**
- High school level **mathematics** (algebra, basic statistics)
- A code editor (VS Code recommended)

::: tip Recommended Background
If you're new to Python, start with basic Python tutorials first. Understanding loops, functions, and data structures is essential for AI development.
:::

## Quick Start

### Setting Up Your Environment

```bash
# Create a virtual environment
python -m venv ai-env

# Activate it (macOS/Linux)
source ai-env/bin/activate

# Activate it (Windows)
ai-env\Scripts\activate

# Install essential packages
pip install numpy pandas scikit-learn matplotlib jupyter

# For deep learning
pip install torch torchvision  # PyTorch
# or
pip install tensorflow  # TensorFlow

# For working with LLMs
pip install openai langchain
```

### Your First AI Code

```python
# Simple sentiment analysis
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Training data
texts = ["I love this!", "This is great!", "I hate this", "This is terrible"]
labels = [1, 1, 0, 0]  # 1 = positive, 0 = negative

# Create and train model
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)
model = MultinomialNB()
model.fit(X, labels)

# Make prediction
new_text = ["I really enjoy this"]
prediction = model.predict(vectorizer.transform(new_text))
print("Positive!" if prediction[0] == 1 else "Negative!")
```

## Core Concepts Overview

### 1. Machine Learning Types

```
Machine Learning
├── Supervised Learning (labeled data)
│   ├── Classification (categories)
│   └── Regression (continuous values)
├── Unsupervised Learning (unlabeled data)
│   ├── Clustering
│   └── Dimensionality Reduction
└── Reinforcement Learning (rewards)
```

### 2. Neural Networks

```python
import torch
import torch.nn as nn

class SimpleNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(784, 128),
            nn.ReLU(),
            nn.Linear(128, 10)
        )

    def forward(self, x):
        return self.layers(x)
```

### 3. Large Language Models (LLMs)

```python
from openai import OpenAI

client = OpenAI()

# Chat completion
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain AI in simple terms."}
    ]
)
```

### 4. Prompt Engineering

```python
# Zero-shot prompting
prompt = "Classify the sentiment: 'I love this product!'"

# Few-shot prompting
prompt = """
Classify the sentiment:
'Great product!' -> Positive
'Terrible experience' -> Negative
'I love this product!' -> """
```

## AI vs ML vs Deep Learning

| Aspect | AI | Machine Learning | Deep Learning |
|--------|-----|-----------------|---------------|
| Definition | Broad field of intelligent machines | Subset of AI using data | Subset of ML using neural networks |
| Data Needs | Varies | Moderate | Large amounts |
| Complexity | Varies | Medium | High |
| Examples | Chatbots, robotics | Recommendations, spam filters | Image recognition, NLP |

## Common Use Cases

AI & Machine Learning are used for:

- **Natural Language Processing** - Chatbots, translation, summarization
- **Computer Vision** - Image recognition, object detection
- **Recommendation Systems** - Netflix, Spotify, Amazon suggestions
- **Predictive Analytics** - Sales forecasting, risk assessment
- **Autonomous Systems** - Self-driving cars, drones
- **Generative AI** - Content creation, art, code generation

## Essential Tools & Libraries

### Python Libraries

| Library | Purpose |
|---------|---------|
| NumPy | Numerical computing |
| Pandas | Data manipulation |
| Scikit-learn | Traditional ML algorithms |
| TensorFlow | Deep learning (Google) |
| PyTorch | Deep learning (Meta) |
| Hugging Face | Pre-trained models & transformers |
| LangChain | LLM application development |
| OpenAI | GPT models API |

### Development Tools

```bash
# Jupyter Notebook for experimentation
pip install jupyter
jupyter notebook

# MLflow for experiment tracking
pip install mlflow

# Weights & Biases for visualization
pip install wandb
```

## What You'll Build

Throughout this tutorial, you'll build:

- A sentiment analysis classifier
- An image recognition model
- A chatbot using LLMs
- A RAG (Retrieval-Augmented Generation) system
- An AI agent that can perform tasks

## Video Tutorials

::: tip Recommended Video Resources
Learn AI & Machine Learning through these excellent video tutorials.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [Machine Learning Course](https://www.youtube.com/watch?v=i_LwzRVP7bg) | freeCodeCamp | 10-hour comprehensive course |
| [Deep Learning Tutorial](https://www.youtube.com/watch?v=VyWAvY2CF9c) | freeCodeCamp | 6-hour PyTorch course |
| [AI Full Course](https://www.youtube.com/watch?v=JMUxmLyrhSk) | Edureka | 10-hour AI course |
| [Machine Learning in 100 Seconds](https://www.youtube.com/watch?v=PeMlggyqz0Y) | Fireship | Quick 100-second explanation |

### Official Resources

| Resource | Description |
|----------|-------------|
| [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course) | Free ML course from Google |
| [Fast.ai](https://www.fast.ai/) | Practical deep learning for coders |
| [Hugging Face Course](https://huggingface.co/course) | Free NLP and Transformers course |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| Neural Networks | [Neural Networks Explained](https://www.youtube.com/watch?v=aircAruvnKk) | ~20 min |
| LangChain | [LangChain Tutorial](https://www.youtube.com/watch?v=aywZrzNaKjs) | ~1 hour |
| OpenAI API | [ChatGPT API Tutorial](https://www.youtube.com/watch?v=uRQH2CFvedY) | ~30 min |
| RAG | [RAG Tutorial](https://www.youtube.com/watch?v=T-D1OfcDW1M) | ~45 min |

Let's begin your AI journey!

---

[Start with Introduction →](/guide/ai/01-introduction)
