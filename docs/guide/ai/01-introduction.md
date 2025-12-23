# Introduction to AI

Welcome to the first lesson of our AI tutorial! In this lesson, we'll explore the fundamentals of Artificial Intelligence - what it is, its history, and the different types of AI systems.

## What is Artificial Intelligence?

Artificial Intelligence (AI) is the field of computer science dedicated to creating systems that can perform tasks that typically require human intelligence. These tasks include:

- **Learning** - Acquiring information and rules for using it
- **Reasoning** - Using rules to reach conclusions
- **Problem-solving** - Finding solutions to complex problems
- **Perception** - Interpreting sensory input (images, sound, text)
- **Language understanding** - Processing and generating human language

```python
# AI in action: A simple chatbot response
def simple_ai_response(user_input):
    """A rule-based AI that responds to greetings"""
    greetings = ["hello", "hi", "hey", "greetings"]

    if any(word in user_input.lower() for word in greetings):
        return "Hello! How can I help you today?"
    elif "weather" in user_input.lower():
        return "I can help you check the weather!"
    else:
        return "I'm not sure how to respond to that."

# Test it
print(simple_ai_response("Hello there!"))
# Output: Hello! How can I help you today?
```

## A Brief History of AI

| Era | Period | Key Developments |
|-----|--------|-----------------|
| Birth of AI | 1950s | Turing Test, Dartmouth Conference, term "AI" coined |
| Early Enthusiasm | 1960s | First chatbots (ELIZA), expert systems |
| AI Winter | 1970s-80s | Reduced funding, limited progress |
| Revival | 1990s | Machine learning advances, Deep Blue beats Kasparov |
| Deep Learning | 2010s | ImageNet breakthrough, AlphaGo, transformers |
| Generative AI | 2020s | GPT, DALL-E, ChatGPT, multimodal AI |

### Key Milestones

```
1950 - Alan Turing proposes the Turing Test
1956 - "Artificial Intelligence" term coined at Dartmouth
1966 - ELIZA chatbot created
1997 - Deep Blue defeats chess champion Kasparov
2011 - IBM Watson wins Jeopardy!
2012 - AlexNet revolutionizes image recognition
2016 - AlphaGo defeats Go world champion
2017 - Transformer architecture introduced
2022 - ChatGPT launches, AI goes mainstream
2023 - GPT-4, multimodal AI models
```

## Types of AI

### By Capability

#### 1. Narrow AI (Weak AI)
AI designed for specific tasks. This is what we have today.

```python
# Example: A spam classifier (Narrow AI)
def classify_spam(email_text):
    spam_keywords = ["winner", "free money", "click here", "urgent"]
    spam_score = sum(1 for word in spam_keywords if word in email_text.lower())
    return "spam" if spam_score >= 2 else "not spam"
```

**Examples:**
- Virtual assistants (Siri, Alexa)
- Recommendation systems (Netflix, Spotify)
- Image recognition
- Language translation

#### 2. General AI (Strong AI)
AI with human-level intelligence across all tasks. **This doesn't exist yet.**

- Would understand context like humans
- Could learn any intellectual task
- Remains a research goal

#### 3. Super AI
AI surpassing human intelligence. **Theoretical and doesn't exist.**

- Would exceed human capabilities in all areas
- Subject of much debate and speculation

### By Functionality

| Type | Description | Example |
|------|-------------|---------|
| Reactive Machines | Respond to inputs, no memory | Chess-playing AI |
| Limited Memory | Can use past data for decisions | Self-driving cars |
| Theory of Mind | Understand emotions/intentions | Research stage |
| Self-Aware | Have consciousness | Doesn't exist |

## AI vs Machine Learning vs Deep Learning

Understanding the relationship between these terms is crucial:

```
┌─────────────────────────────────────────────┐
│            Artificial Intelligence           │
│  ┌───────────────────────────────────────┐  │
│  │         Machine Learning               │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │        Deep Learning             │  │  │
│  │  │                                  │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

| Concept | Definition | Key Characteristic |
|---------|------------|-------------------|
| AI | Machines that mimic human intelligence | Broad field |
| Machine Learning | AI that learns from data | Improves with experience |
| Deep Learning | ML using neural networks | Multiple layers of processing |

## How AI Works: A Simple Overview

### The Basic Process

```python
# Simplified AI workflow
def ai_workflow():
    # 1. Data Collection
    data = collect_data()

    # 2. Data Preprocessing
    clean_data = preprocess(data)

    # 3. Model Training
    model = train_model(clean_data)

    # 4. Prediction
    result = model.predict(new_input)

    # 5. Evaluation & Improvement
    evaluate_and_improve(model, result)

    return result
```

### Key Components

1. **Data** - The fuel that powers AI systems
2. **Algorithms** - The instructions for learning
3. **Compute** - The hardware that runs calculations
4. **Models** - The trained systems that make predictions

## Real-World AI Applications

### Natural Language Processing (NLP)

```python
# Example: Sentiment Analysis
from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0:
        return "Positive"
    elif polarity < 0:
        return "Negative"
    else:
        return "Neutral"

# Test
print(analyze_sentiment("I love learning AI!"))
# Output: Positive
```

### Computer Vision

```python
# Example: Image Classification (conceptual)
from torchvision import models, transforms
from PIL import Image

def classify_image(image_path):
    # Load pre-trained model
    model = models.resnet50(pretrained=True)
    model.eval()

    # Preprocess image
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
    ])

    image = Image.open(image_path)
    input_tensor = transform(image).unsqueeze(0)

    # Get prediction
    output = model(input_tensor)
    return output.argmax().item()
```

### Recommendation Systems

```python
# Simplified collaborative filtering concept
def recommend_items(user_id, user_item_matrix):
    """Find items liked by similar users"""
    user_preferences = user_item_matrix[user_id]

    # Find similar users
    similar_users = find_similar_users(user_preferences, user_item_matrix)

    # Get items they liked that current user hasn't seen
    recommendations = get_unseen_items(user_id, similar_users)

    return recommendations
```

## AI Ethics and Considerations

::: warning Important Considerations
As you learn AI, always consider the ethical implications of the systems you build.
:::

### Key Ethical Issues

| Issue | Description |
|-------|-------------|
| Bias | AI can perpetuate or amplify existing biases |
| Privacy | AI systems often require large amounts of data |
| Transparency | "Black box" models are hard to explain |
| Job Displacement | AI automation affects employment |
| Misuse | AI can be used for harmful purposes |

### Best Practices

```python
# Example: Checking for bias in predictions
def check_model_fairness(model, test_data, sensitive_attribute):
    """Check if model performs equally across groups"""
    groups = test_data.groupby(sensitive_attribute)

    results = {}
    for group_name, group_data in groups:
        predictions = model.predict(group_data)
        accuracy = calculate_accuracy(predictions, group_data.labels)
        results[group_name] = accuracy

    # Check for significant differences
    if max(results.values()) - min(results.values()) > 0.1:
        print("Warning: Potential fairness issue detected!")

    return results
```

## Setting Up Your AI Environment

### Essential Tools

```bash
# Create a dedicated environment
python -m venv ai-learning
source ai-learning/bin/activate  # macOS/Linux

# Install core packages
pip install numpy pandas matplotlib seaborn

# Install ML libraries
pip install scikit-learn

# Install deep learning (choose one)
pip install torch torchvision  # PyTorch
pip install tensorflow          # TensorFlow

# Install Jupyter for experiments
pip install jupyter
```

### Verify Installation

```python
# test_installation.py
import numpy as np
import pandas as pd
import sklearn
import torch  # or tensorflow

print(f"NumPy version: {np.__version__}")
print(f"Pandas version: {pd.__version__}")
print(f"Scikit-learn version: {sklearn.__version__}")
print(f"PyTorch version: {torch.__version__}")

print("\nAll packages installed successfully!")
```

## Summary

In this lesson, you learned:

- **What AI is** - Machines that simulate human intelligence
- **AI History** - From Turing to ChatGPT
- **Types of AI** - Narrow, General, and Super AI
- **AI vs ML vs DL** - The nested relationship
- **Applications** - NLP, Computer Vision, Recommendations
- **Ethics** - Bias, privacy, and responsible AI

## Key Takeaways

::: tip Remember
1. AI is about creating intelligent systems
2. We currently only have Narrow AI
3. Machine Learning is how most modern AI learns
4. Deep Learning powers the most impressive AI today
5. Always consider ethics when building AI
:::

## Exercises

1. **Explore AI Tools**: Try using ChatGPT, Claude, or another AI assistant
2. **Identify AI**: List 5 AI-powered products you use daily
3. **Setup**: Install Python and the required libraries
4. **Research**: Read about one AI ethics case study

## What's Next?

In the next lesson, we'll dive into Machine Learning basics - the core technology behind most modern AI systems.

---

[Next: Machine Learning Basics →](/guide/ai/02-ml-basics)
