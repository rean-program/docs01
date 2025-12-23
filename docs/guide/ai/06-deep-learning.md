# Deep Learning

Deep learning uses neural networks with many layers to learn complex patterns. This lesson covers the key architectures: CNNs, RNNs, and Transformers.

## What Makes Deep Learning "Deep"?

Deep learning refers to neural networks with multiple hidden layers, allowing them to learn hierarchical representations.

```
Shallow Network (1-2 layers):
Input → Hidden → Output

Deep Network (many layers):
Input → Layer1 → Layer2 → ... → LayerN → Output
```

## Convolutional Neural Networks (CNNs)

CNNs are designed for image processing and computer vision tasks.

### How Convolution Works

```python
import numpy as np

# Simple 2D convolution example
def convolve2d(image, kernel):
    """Apply convolution to an image"""
    h, w = image.shape
    kh, kw = kernel.shape
    output = np.zeros((h - kh + 1, w - kw + 1))

    for i in range(output.shape[0]):
        for j in range(output.shape[1]):
            output[i, j] = np.sum(image[i:i+kh, j:j+kw] * kernel)

    return output

# Example: Edge detection kernel
edge_kernel = np.array([
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1]
])

# Apply to an image
sample_image = np.random.rand(10, 10)
edges = convolve2d(sample_image, edge_kernel)
```

### CNN Architecture

```python
import torch
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self, num_classes=10):
        super(SimpleCNN, self).__init__()

        # Convolutional layers
        self.conv_layers = nn.Sequential(
            # Conv Layer 1: 1 channel -> 32 channels
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),  # 28x28 -> 14x14

            # Conv Layer 2: 32 -> 64 channels
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),  # 14x14 -> 7x7

            # Conv Layer 3: 64 -> 128 channels
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),  # 7x7 -> 3x3
        )

        # Fully connected layers
        self.fc_layers = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 3 * 3, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        x = self.conv_layers(x)
        x = self.fc_layers(x)
        return x

# Create model
model = SimpleCNN(num_classes=10)
print(model)
```

### Key CNN Components

| Component | Purpose | Example |
|-----------|---------|---------|
| Convolution | Extract features | nn.Conv2d(3, 64, 3) |
| Pooling | Reduce size | nn.MaxPool2d(2) |
| ReLU | Non-linearity | nn.ReLU() |
| Dropout | Regularization | nn.Dropout(0.5) |
| Batch Norm | Stabilize training | nn.BatchNorm2d(64) |

### Image Classification with CNN

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# Data transforms
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

# Load MNIST
train_data = datasets.MNIST('./data', train=True, download=True, transform=transform)
test_data = datasets.MNIST('./data', train=False, transform=transform)

train_loader = DataLoader(train_data, batch_size=64, shuffle=True)
test_loader = DataLoader(test_data, batch_size=64)

# Model
model = SimpleCNN(num_classes=10)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Train
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

for epoch in range(5):
    model.train()
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

    # Evaluate
    model.eval()
    correct = 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, predicted = outputs.max(1)
            correct += (predicted == labels).sum().item()

    accuracy = correct / len(test_data)
    print(f'Epoch {epoch+1}: Accuracy = {accuracy:.4f}')
```

## Recurrent Neural Networks (RNNs)

RNNs process sequential data by maintaining a hidden state.

### Basic RNN Structure

```python
import torch
import torch.nn as nn

class SimpleRNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleRNN, self).__init__()
        self.hidden_size = hidden_size
        self.rnn = nn.RNN(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        # x shape: (batch, sequence_length, input_size)
        # Initialize hidden state
        h0 = torch.zeros(1, x.size(0), self.hidden_size)

        # RNN forward pass
        out, hidden = self.rnn(x, h0)

        # Take output from last time step
        out = self.fc(out[:, -1, :])
        return out
```

### LSTM (Long Short-Term Memory)

LSTMs solve the vanishing gradient problem with gates.

```python
class LSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size):
        super(LSTMModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.lstm = nn.LSTM(
            input_size,
            hidden_size,
            num_layers,
            batch_first=True,
            dropout=0.2
        )
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        # Initialize hidden state and cell state
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)

        # LSTM forward
        out, (hn, cn) = self.lstm(x, (h0, c0))

        # Decode the hidden state of the last time step
        out = self.fc(out[:, -1, :])
        return out

# Example: Sentiment classification
model = LSTMModel(
    input_size=100,    # Embedding dimension
    hidden_size=256,
    num_layers=2,
    output_size=2      # Positive/Negative
)
```

### Text Classification Example

```python
import torch
import torch.nn as nn

class TextClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, output_dim):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True, bidirectional=True)
        self.fc = nn.Linear(hidden_dim * 2, output_dim)
        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        # x: (batch, seq_len) - word indices
        embedded = self.embedding(x)  # (batch, seq_len, embed_dim)
        output, (hidden, cell) = self.lstm(embedded)

        # Concatenate forward and backward hidden states
        hidden = torch.cat((hidden[-2,:,:], hidden[-1,:,:]), dim=1)
        hidden = self.dropout(hidden)

        return self.fc(hidden)

# Create model
model = TextClassifier(
    vocab_size=10000,
    embed_dim=100,
    hidden_dim=256,
    output_dim=2
)
```

## Transformers

Transformers use attention mechanisms and have revolutionized NLP.

### Self-Attention Mechanism

```python
import torch
import torch.nn as nn
import math

class SelfAttention(nn.Module):
    def __init__(self, embed_size, heads):
        super(SelfAttention, self).__init__()
        self.embed_size = embed_size
        self.heads = heads
        self.head_dim = embed_size // heads

        self.queries = nn.Linear(embed_size, embed_size)
        self.keys = nn.Linear(embed_size, embed_size)
        self.values = nn.Linear(embed_size, embed_size)
        self.fc_out = nn.Linear(embed_size, embed_size)

    def forward(self, x):
        N, seq_length, _ = x.shape

        # Linear projections
        Q = self.queries(x)
        K = self.keys(x)
        V = self.values(x)

        # Reshape for multi-head attention
        Q = Q.view(N, seq_length, self.heads, self.head_dim).transpose(1, 2)
        K = K.view(N, seq_length, self.heads, self.head_dim).transpose(1, 2)
        V = V.view(N, seq_length, self.heads, self.head_dim).transpose(1, 2)

        # Attention scores
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.head_dim)
        attention = torch.softmax(scores, dim=-1)

        # Apply attention to values
        out = torch.matmul(attention, V)

        # Concatenate heads
        out = out.transpose(1, 2).contiguous().view(N, seq_length, self.embed_size)

        return self.fc_out(out)
```

### Transformer Block

```python
class TransformerBlock(nn.Module):
    def __init__(self, embed_size, heads, dropout, forward_expansion):
        super(TransformerBlock, self).__init__()
        self.attention = SelfAttention(embed_size, heads)
        self.norm1 = nn.LayerNorm(embed_size)
        self.norm2 = nn.LayerNorm(embed_size)

        self.feed_forward = nn.Sequential(
            nn.Linear(embed_size, forward_expansion * embed_size),
            nn.ReLU(),
            nn.Linear(forward_expansion * embed_size, embed_size)
        )

        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # Self-attention with residual connection
        attention = self.attention(x)
        x = self.norm1(attention + x)
        x = self.dropout(x)

        # Feed-forward with residual connection
        forward = self.feed_forward(x)
        x = self.norm2(forward + x)
        x = self.dropout(x)

        return x
```

### Using Pre-trained Transformers (Hugging Face)

```python
from transformers import AutoTokenizer, AutoModel, pipeline

# Easy way: Use pipelines
classifier = pipeline("sentiment-analysis")
result = classifier("I love this movie!")
print(result)  # [{'label': 'POSITIVE', 'score': 0.9998}]

# More control: Use models directly
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

# Tokenize text
text = "Hello, how are you?"
inputs = tokenizer(text, return_tensors="pt")

# Get embeddings
with torch.no_grad():
    outputs = model(**inputs)
    embeddings = outputs.last_hidden_state

print(f"Embedding shape: {embeddings.shape}")
```

## Comparison of Architectures

| Architecture | Best For | Key Feature |
|--------------|----------|-------------|
| CNN | Images, spatial data | Local patterns via convolution |
| RNN/LSTM | Sequences, time series | Memory of past inputs |
| Transformer | Text, any sequence | Attention mechanism |

## Transfer Learning

Use pre-trained models to save time and improve results:

```python
import torch
import torchvision.models as models
import torch.nn as nn

# Load pre-trained ResNet
model = models.resnet50(pretrained=True)

# Freeze all layers
for param in model.parameters():
    param.requires_grad = False

# Replace final layer for your task
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, 10)  # 10 classes

# Only train the new layer
optimizer = torch.optim.Adam(model.fc.parameters(), lr=0.001)
```

## Common Deep Learning Patterns

```python
# 1. Learning rate scheduling
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.1)

# 2. Early stopping
best_loss = float('inf')
patience = 5
counter = 0

for epoch in range(100):
    val_loss = validate(model)
    if val_loss < best_loss:
        best_loss = val_loss
        counter = 0
        torch.save(model.state_dict(), 'best_model.pt')
    else:
        counter += 1
        if counter >= patience:
            print("Early stopping!")
            break

# 3. Data augmentation for images
transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2),
    transforms.ToTensor(),
])
```

## Summary

| Concept | Description |
|---------|-------------|
| CNN | Extract spatial features from images |
| RNN/LSTM | Process sequential data with memory |
| Transformer | Attention-based sequence processing |
| Transfer Learning | Leverage pre-trained models |

## Exercises

1. Build a CNN for CIFAR-10 classification
2. Create an LSTM for text generation
3. Fine-tune a pre-trained BERT model
4. Compare CNN vs Transformer for image classification

---

[Next: Working with LLMs →](/guide/ai/07-llms)
