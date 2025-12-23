# Neural Networks

Welcome to neural networks - the foundation of deep learning! In this lesson, you'll learn how neural networks work and build one from scratch.

## What is a Neural Network?

A neural network is a computing system inspired by biological neural networks in the brain. It consists of interconnected nodes (neurons) organized in layers that process information.

```
Input Layer      Hidden Layer(s)     Output Layer
    ●────────────────●────────────────●
    ●────────────────●────────────────●
    ●────────────────●
    ●────────────────●
```

## The Perceptron: A Single Neuron

The perceptron is the simplest neural network - just one neuron.

```python
import numpy as np

class Perceptron:
    """A single neuron"""

    def __init__(self, n_inputs):
        # Initialize random weights and bias
        self.weights = np.random.randn(n_inputs)
        self.bias = np.random.randn()

    def forward(self, x):
        """Calculate output"""
        # Weighted sum + bias
        z = np.dot(x, self.weights) + self.bias
        # Activation function (step function)
        return 1 if z > 0 else 0

# Example: AND gate
perceptron = Perceptron(2)

# Training data for AND
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([0, 0, 0, 1])

# Test
for inputs, expected in zip(X, y):
    output = perceptron.forward(inputs)
    print(f"{inputs} -> {output} (expected: {expected})")
```

## How Neurons Work

### 1. Linear Transformation

```python
# Each neuron computes:
# z = w1*x1 + w2*x2 + ... + wn*xn + b
# z = weights · inputs + bias

def linear_transform(x, weights, bias):
    return np.dot(x, weights) + bias
```

### 2. Activation Functions

Activation functions introduce non-linearity, allowing networks to learn complex patterns.

```python
import numpy as np
import matplotlib.pyplot as plt

# Common activation functions
def sigmoid(x):
    """Squashes values to (0, 1)"""
    return 1 / (1 + np.exp(-x))

def relu(x):
    """Rectified Linear Unit - most popular"""
    return np.maximum(0, x)

def tanh(x):
    """Squashes values to (-1, 1)"""
    return np.tanh(x)

def softmax(x):
    """Converts to probabilities (for classification)"""
    exp_x = np.exp(x - np.max(x))
    return exp_x / exp_x.sum()

# Visualize activation functions
x = np.linspace(-5, 5, 100)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

axes[0, 0].plot(x, sigmoid(x))
axes[0, 0].set_title('Sigmoid')
axes[0, 0].grid(True)

axes[0, 1].plot(x, relu(x))
axes[0, 1].set_title('ReLU')
axes[0, 1].grid(True)

axes[1, 0].plot(x, tanh(x))
axes[1, 0].set_title('Tanh')
axes[1, 0].grid(True)

axes[1, 1].plot(x, np.exp(x) / np.sum(np.exp(x)))
axes[1, 1].set_title('Softmax (single value)')
axes[1, 1].grid(True)

plt.tight_layout()
plt.show()
```

| Activation | Formula | Output Range | Use Case |
|------------|---------|--------------|----------|
| Sigmoid | 1/(1+e^-x) | (0, 1) | Binary classification output |
| ReLU | max(0, x) | [0, ∞) | Hidden layers (most common) |
| Tanh | tanh(x) | (-1, 1) | Hidden layers |
| Softmax | e^xi / Σe^xj | (0, 1), sum=1 | Multi-class output |

## Building a Neural Network from Scratch

Let's build a simple 2-layer network:

```python
import numpy as np

class NeuralNetwork:
    """A simple 2-layer neural network"""

    def __init__(self, input_size, hidden_size, output_size):
        # Initialize weights randomly
        self.W1 = np.random.randn(input_size, hidden_size) * 0.01
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.01
        self.b2 = np.zeros((1, output_size))

    def sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

    def sigmoid_derivative(self, x):
        return x * (1 - x)

    def forward(self, X):
        """Forward pass"""
        # Hidden layer
        self.z1 = np.dot(X, self.W1) + self.b1
        self.a1 = self.sigmoid(self.z1)

        # Output layer
        self.z2 = np.dot(self.a1, self.W2) + self.b2
        self.a2 = self.sigmoid(self.z2)

        return self.a2

    def backward(self, X, y, learning_rate=0.1):
        """Backward pass (gradient descent)"""
        m = X.shape[0]  # Number of samples

        # Output layer error
        output_error = self.a2 - y
        output_delta = output_error * self.sigmoid_derivative(self.a2)

        # Hidden layer error
        hidden_error = output_delta.dot(self.W2.T)
        hidden_delta = hidden_error * self.sigmoid_derivative(self.a1)

        # Update weights
        self.W2 -= learning_rate * self.a1.T.dot(output_delta) / m
        self.b2 -= learning_rate * np.sum(output_delta, axis=0, keepdims=True) / m
        self.W1 -= learning_rate * X.T.dot(hidden_delta) / m
        self.b1 -= learning_rate * np.sum(hidden_delta, axis=0, keepdims=True) / m

    def train(self, X, y, epochs=1000, learning_rate=0.1):
        """Train the network"""
        losses = []

        for epoch in range(epochs):
            # Forward pass
            output = self.forward(X)

            # Calculate loss
            loss = np.mean((y - output) ** 2)
            losses.append(loss)

            # Backward pass
            self.backward(X, y, learning_rate)

            if epoch % 100 == 0:
                print(f"Epoch {epoch}, Loss: {loss:.4f}")

        return losses

# Example: XOR problem (cannot be solved by single perceptron)
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])

# Create and train network
nn = NeuralNetwork(input_size=2, hidden_size=4, output_size=1)
losses = nn.train(X, y, epochs=1000, learning_rate=1.0)

# Test
print("\nPredictions:")
predictions = nn.forward(X)
for inputs, pred, expected in zip(X, predictions, y):
    print(f"{inputs} -> {pred[0]:.4f} (expected: {expected[0]})")

# Plot loss
plt.plot(losses)
plt.title('Training Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.show()
```

## Understanding Backpropagation

Backpropagation is how neural networks learn. It calculates how much each weight contributed to the error.

```
Forward Pass:   Input → Hidden → Output → Loss
                  ↓        ↓        ↓       ↓
Backward Pass:  Input ← Hidden ← Output ← Loss
                Update   Update   Update  Calculate
                weights  weights  weights  error
```

### The Chain Rule

```python
# Backpropagation uses the chain rule of calculus
# If y = f(g(x)), then dy/dx = dy/dg * dg/dx

# For a neural network:
# Loss depends on output, which depends on weights
# dLoss/dWeight = dLoss/dOutput * dOutput/dWeight

def backpropagation_example():
    """Simple example of chain rule in backprop"""

    # Forward pass
    x = 2.0
    w = 3.0
    b = 1.0

    # y = wx + b
    y = w * x + b  # y = 7

    # Loss = (y - target)^2
    target = 5.0
    loss = (y - target) ** 2  # loss = 4

    # Backward pass
    # dLoss/dy = 2(y - target)
    dloss_dy = 2 * (y - target)  # = 4

    # dy/dw = x
    dy_dw = x  # = 2

    # dLoss/dw = dLoss/dy * dy/dw
    dloss_dw = dloss_dy * dy_dw  # = 8

    print(f"Gradient of loss w.r.t. weight: {dloss_dw}")

    # Update weight
    learning_rate = 0.01
    w_new = w - learning_rate * dloss_dw
    print(f"New weight: {w_new}")
```

## Neural Networks with PyTorch

PyTorch makes building neural networks much easier:

```python
import torch
import torch.nn as nn
import torch.optim as optim

# Define the network
class SimpleNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleNN, self).__init__()
        self.layer1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.layer2 = nn.Linear(hidden_size, output_size)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.layer1(x)
        x = self.relu(x)
        x = self.layer2(x)
        x = self.sigmoid(x)
        return x

# Create network
model = SimpleNN(input_size=2, hidden_size=4, output_size=1)

# Loss function and optimizer
criterion = nn.BCELoss()  # Binary Cross Entropy
optimizer = optim.Adam(model.parameters(), lr=0.1)

# Training data (XOR)
X = torch.tensor([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=torch.float32)
y = torch.tensor([[0], [1], [1], [0]], dtype=torch.float32)

# Training loop
for epoch in range(1000):
    # Forward pass
    outputs = model(X)
    loss = criterion(outputs, y)

    # Backward pass
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if epoch % 100 == 0:
        print(f'Epoch {epoch}, Loss: {loss.item():.4f}')

# Test
with torch.no_grad():
    predictions = model(X)
    print("\nPredictions:")
    print(predictions.numpy())
```

## Network Architecture Choices

### Number of Layers

| Depth | Use Case |
|-------|----------|
| 1-2 layers | Simple problems, tabular data |
| 3-5 layers | Moderate complexity |
| 10+ layers | Complex patterns (images, text) |

### Number of Neurons

```python
# Rule of thumb:
# - Start with hidden_size between input_size and output_size
# - Increase if underfitting
# - Decrease if overfitting

# Common patterns:
# Funnel: 784 -> 256 -> 64 -> 10
# Same:   784 -> 256 -> 256 -> 10
# Hourglass: 784 -> 64 -> 64 -> 784 (autoencoders)
```

### Choosing Activations

```python
import torch.nn as nn

# Modern best practices:
class ModernNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(784, 256),
            nn.ReLU(),           # ReLU for hidden layers
            nn.Dropout(0.2),     # Regularization
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 10),
            # No activation here if using CrossEntropyLoss
            # Or use Softmax for multi-class classification
        )

    def forward(self, x):
        return self.layers(x)
```

## Complete Example: MNIST Digit Classification

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# Hyperparameters
BATCH_SIZE = 64
LEARNING_RATE = 0.001
EPOCHS = 5

# Load MNIST dataset
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))
])

train_dataset = datasets.MNIST('./data', train=True, download=True, transform=transform)
test_dataset = datasets.MNIST('./data', train=False, transform=transform)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE)

# Define the network
class MNISTClassifier(nn.Module):
    def __init__(self):
        super(MNISTClassifier, self).__init__()
        self.flatten = nn.Flatten()
        self.layers = nn.Sequential(
            nn.Linear(28 * 28, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 10)
        )

    def forward(self, x):
        x = self.flatten(x)
        return self.layers(x)

# Create model, loss, optimizer
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = MNISTClassifier().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# Training function
def train(model, loader, criterion, optimizer):
    model.train()
    total_loss = 0

    for batch_idx, (data, target) in enumerate(loader):
        data, target = data.to(device), target.to(device)

        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    return total_loss / len(loader)

# Evaluation function
def evaluate(model, loader):
    model.eval()
    correct = 0
    total = 0

    with torch.no_grad():
        for data, target in loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            _, predicted = torch.max(output.data, 1)
            total += target.size(0)
            correct += (predicted == target).sum().item()

    return correct / total

# Training loop
for epoch in range(EPOCHS):
    train_loss = train(model, train_loader, criterion, optimizer)
    accuracy = evaluate(model, test_loader)
    print(f'Epoch {epoch+1}: Loss={train_loss:.4f}, Accuracy={accuracy:.4f}')

print(f"\nFinal Test Accuracy: {evaluate(model, test_loader):.4f}")
```

## Summary

| Concept | Description |
|---------|-------------|
| Neuron | Basic unit: weighted sum + activation |
| Layer | Collection of neurons |
| Activation | Non-linear function (ReLU, Sigmoid, etc.) |
| Forward Pass | Input → Output calculation |
| Backpropagation | Calculate gradients using chain rule |
| Gradient Descent | Update weights to minimize loss |

## Exercises

1. Build a neural network from scratch for AND/OR gates
2. Experiment with different activation functions
3. Train an MNIST classifier and visualize predictions
4. Try different architectures and compare performance

---

[Next: Deep Learning →](/guide/ai/06-deep-learning)
