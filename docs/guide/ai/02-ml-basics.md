# Machine Learning Basics

Welcome to the Machine Learning basics lesson! Here you'll learn the fundamental concepts that power modern AI systems.

## What is Machine Learning?

Machine Learning (ML) is a subset of AI that enables computers to learn from data without being explicitly programmed. Instead of writing rules, we show the computer examples and let it discover patterns.

```python
# Traditional Programming vs Machine Learning

# Traditional: We write the rules
def is_spam_traditional(email):
    if "free money" in email or "click here" in email:
        return True
    return False

# Machine Learning: Computer learns the rules from data
from sklearn.naive_bayes import MultinomialNB

# We provide examples, ML finds the patterns
model = MultinomialNB()
model.fit(training_emails, labels)  # Learn from data
prediction = model.predict(new_email)  # Apply learned patterns
```

## The Three Types of Machine Learning

### 1. Supervised Learning

The model learns from labeled data - inputs paired with correct outputs.

```python
# Supervised Learning Example: House Price Prediction
from sklearn.linear_model import LinearRegression
import numpy as np

# Training data (features: size in sqft, bedrooms)
X_train = np.array([
    [1000, 2],
    [1500, 3],
    [2000, 3],
    [2500, 4],
])

# Labels (prices in $1000s)
y_train = np.array([200, 300, 350, 450])

# Train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict price for a new house
new_house = np.array([[1800, 3]])
predicted_price = model.predict(new_house)
print(f"Predicted price: ${predicted_price[0]:.0f}k")
```

**Common Supervised Learning Tasks:**

| Task | Description | Example |
|------|-------------|---------|
| Classification | Predict a category | Email spam detection |
| Regression | Predict a number | House price prediction |

### 2. Unsupervised Learning

The model finds patterns in unlabeled data.

```python
# Unsupervised Learning Example: Customer Segmentation
from sklearn.cluster import KMeans
import numpy as np

# Customer data (spending score, annual income)
customers = np.array([
    [15, 39], [16, 81], [17, 6],
    [85, 77], [90, 40], [88, 76],
    [50, 42], [48, 52], [55, 45],
])

# Find 3 customer segments
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(customers)

# See which segment each customer belongs to
print(f"Customer segments: {kmeans.labels_}")
# Output: [0, 0, 0, 1, 1, 1, 2, 2, 2]
```

**Common Unsupervised Learning Tasks:**

| Task | Description | Example |
|------|-------------|---------|
| Clustering | Group similar items | Customer segmentation |
| Dimensionality Reduction | Simplify data | Feature compression |
| Association | Find relationships | Market basket analysis |

### 3. Reinforcement Learning

The model learns by interacting with an environment and receiving rewards.

```python
# Reinforcement Learning Concept (simplified)
class SimpleAgent:
    def __init__(self):
        self.q_table = {}  # Stores learned values

    def choose_action(self, state, epsilon=0.1):
        """Choose action using epsilon-greedy strategy"""
        import random
        if random.random() < epsilon:
            return random.choice(['left', 'right'])  # Explore
        return self.get_best_action(state)  # Exploit

    def learn(self, state, action, reward, next_state):
        """Update Q-values based on reward"""
        # Q-learning update rule
        old_value = self.q_table.get((state, action), 0)
        next_max = max(self.q_table.get((next_state, a), 0)
                       for a in ['left', 'right'])

        # Learning rate = 0.1, discount factor = 0.9
        new_value = old_value + 0.1 * (reward + 0.9 * next_max - old_value)
        self.q_table[(state, action)] = new_value
```

**Reinforcement Learning Applications:**
- Game playing (AlphaGo, game AI)
- Robotics
- Autonomous vehicles
- Resource management

## The Machine Learning Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                   ML Development Workflow                    │
├─────────────────────────────────────────────────────────────┤
│  1. Define Problem → 2. Collect Data → 3. Prepare Data     │
│         ↓                                    ↓               │
│  6. Deploy Model ← 5. Evaluate Model ← 4. Train Model      │
│         ↓                                                    │
│  7. Monitor & Improve (continuous cycle)                    │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step Example

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. Load Data
data = pd.read_csv('customer_churn.csv')

# 2. Prepare Data
X = data.drop('churned', axis=1)  # Features
y = data['churned']                # Target

# 3. Split Data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. Scale Features (important for many algorithms)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 5. Train Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# 6. Evaluate Model
predictions = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy: {accuracy:.2%}")
print(classification_report(y_test, predictions))
```

## Key ML Concepts

### Features and Labels

```python
# Features (X): Input variables used to make predictions
# Labels (y): Output variable we want to predict

import pandas as pd

# Example dataset
data = {
    'size_sqft': [1000, 1500, 2000],      # Feature
    'bedrooms': [2, 3, 4],                  # Feature
    'age_years': [5, 10, 2],                # Feature
    'price': [200000, 300000, 400000]       # Label
}

df = pd.DataFrame(data)

X = df[['size_sqft', 'bedrooms', 'age_years']]  # Features
y = df['price']                                   # Label
```

### Training, Validation, and Test Sets

```python
from sklearn.model_selection import train_test_split

# First split: separate test set (held out until final evaluation)
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Second split: create validation set from training data
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.25, random_state=42
)

# Result: 60% train, 20% validation, 20% test
print(f"Training: {len(X_train)}, Validation: {len(X_val)}, Test: {len(X_test)}")
```

| Set | Purpose | When Used |
|-----|---------|-----------|
| Training | Learn patterns | During training |
| Validation | Tune hyperparameters | During development |
| Test | Final evaluation | Only at the end |

### Overfitting vs Underfitting

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# Generate sample data
np.random.seed(42)
X = np.linspace(0, 10, 20).reshape(-1, 1)
y = 2 * X.flatten() + 1 + np.random.normal(0, 2, 20)

# Underfitting: Too simple (degree 0 - just the mean)
# Good fit: Appropriate complexity (degree 1 - linear)
# Overfitting: Too complex (degree 15 - follows noise)

for degree in [0, 1, 15]:
    poly = PolynomialFeatures(degree=degree)
    X_poly = poly.fit_transform(X)
    model = LinearRegression()
    model.fit(X_poly, y)
    print(f"Degree {degree}: Training R² = {model.score(X_poly, y):.3f}")
```

::: warning Recognizing Overfitting
- High training accuracy, low test accuracy
- Model memorizes training data instead of learning patterns
- Complex models with few training samples
:::

### Bias-Variance Tradeoff

| Concept | High Bias | High Variance |
|---------|-----------|---------------|
| Problem | Underfitting | Overfitting |
| Cause | Model too simple | Model too complex |
| Training Error | High | Low |
| Test Error | High | High |
| Solution | Add features, complexity | Regularization, more data |

## Common ML Algorithms

### For Classification

```python
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier

classifiers = {
    'Logistic Regression': LogisticRegression(),
    'Decision Tree': DecisionTreeClassifier(),
    'Random Forest': RandomForestClassifier(),
    'SVM': SVC(),
    'KNN': KNeighborsClassifier()
}

# Compare all classifiers
for name, clf in classifiers.items():
    clf.fit(X_train, y_train)
    accuracy = clf.score(X_test, y_test)
    print(f"{name}: {accuracy:.2%}")
```

### For Regression

```python
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

regressors = {
    'Linear Regression': LinearRegression(),
    'Ridge': Ridge(),
    'Lasso': Lasso(),
    'Decision Tree': DecisionTreeRegressor(),
    'Random Forest': RandomForestRegressor()
}
```

### Algorithm Selection Guide

| Scenario | Recommended Algorithm |
|----------|----------------------|
| Small dataset, interpretability needed | Logistic Regression, Decision Tree |
| Large dataset, high accuracy needed | Random Forest, Gradient Boosting |
| Many features | Random Forest, SVM |
| Linear relationships | Linear/Logistic Regression |
| Complex relationships | Neural Networks, Ensemble Methods |

## Model Evaluation Metrics

### Classification Metrics

```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)

# Make predictions
y_pred = model.predict(X_test)

# Calculate metrics
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.3f}")
print(f"Precision: {precision_score(y_test, y_pred):.3f}")
print(f"Recall:    {recall_score(y_test, y_pred):.3f}")
print(f"F1 Score:  {f1_score(y_test, y_pred):.3f}")

# Confusion Matrix
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Detailed Report
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
```

| Metric | Formula | Use When |
|--------|---------|----------|
| Accuracy | (TP + TN) / Total | Balanced classes |
| Precision | TP / (TP + FP) | False positives are costly |
| Recall | TP / (TP + FN) | False negatives are costly |
| F1 Score | 2 × (P × R) / (P + R) | Balance precision & recall |

### Regression Metrics

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"MSE:  {mse:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"MAE:  {mae:.2f}")
print(f"R²:   {r2:.3f}")
```

## Cross-Validation

Cross-validation gives a more reliable estimate of model performance.

```python
from sklearn.model_selection import cross_val_score, KFold

# 5-fold cross-validation
model = RandomForestClassifier(random_state=42)
scores = cross_val_score(model, X, y, cv=5)

print(f"CV Scores: {scores}")
print(f"Mean: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")

# Custom cross-validation
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=kfold)
```

## Practical Example: Iris Classification

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import pandas as pd

# Load famous Iris dataset
iris = load_iris()
X = pd.DataFrame(iris.data, columns=iris.feature_names)
y = iris.target

print("Dataset shape:", X.shape)
print("Classes:", iris.target_names)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
print(classification_report(y_test, y_pred, target_names=iris.target_names))

# Feature importance
importance = pd.DataFrame({
    'feature': iris.feature_names,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)
print("\nFeature Importance:")
print(importance)
```

## Summary

In this lesson, you learned:

- **Supervised Learning** - Learning from labeled data
- **Unsupervised Learning** - Finding patterns in unlabeled data
- **Reinforcement Learning** - Learning through rewards
- **ML Workflow** - From data to deployment
- **Key Concepts** - Features, labels, train/test splits
- **Common Algorithms** - Classification and regression
- **Evaluation Metrics** - Measuring model performance

## Exercises

1. Load the Iris dataset and train different classifiers
2. Compare accuracy of at least 3 different algorithms
3. Implement cross-validation and compare to simple train/test split
4. Try to intentionally overfit a model and observe the results

---

[Next: Python for AI →](/guide/ai/03-python-for-ai)
