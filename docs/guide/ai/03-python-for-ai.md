# Python for AI

This lesson covers the essential Python libraries you need for AI and Machine Learning development.

## Why Python for AI?

Python is the dominant language in AI for several reasons:

| Advantage | Description |
|-----------|-------------|
| Simple Syntax | Easy to learn and read |
| Rich Ecosystem | NumPy, Pandas, Scikit-learn, PyTorch, TensorFlow |
| Community | Massive community and resources |
| Prototyping | Quick experimentation |
| Integration | Works well with C/C++ for performance |

## NumPy: Numerical Computing

NumPy is the foundation for numerical computing in Python.

### Creating Arrays

```python
import numpy as np

# Create arrays
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.array([[1, 2, 3], [4, 5, 6]])

# Special arrays
zeros = np.zeros((3, 3))           # 3x3 array of zeros
ones = np.ones((2, 4))             # 2x4 array of ones
identity = np.eye(3)               # 3x3 identity matrix
random = np.random.randn(3, 3)     # Random values (normal distribution)
range_arr = np.arange(0, 10, 2)    # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5)    # 5 evenly spaced values from 0 to 1

print(f"Shape of arr2: {arr2.shape}")  # (2, 3)
print(f"Data type: {arr1.dtype}")       # int64
```

### Array Operations

```python
import numpy as np

a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

# Element-wise operations
print(a + b)      # [ 6  8 10 12]
print(a * b)      # [ 5 12 21 32]
print(a ** 2)     # [ 1  4  9 16]
print(np.sqrt(a)) # [1.  1.41 1.73 2.]

# Statistical operations
print(np.mean(a))   # 2.5
print(np.std(a))    # 1.118
print(np.sum(a))    # 10
print(np.max(a))    # 4
print(np.argmax(a)) # 3 (index of max)

# Matrix operations
matrix_a = np.array([[1, 2], [3, 4]])
matrix_b = np.array([[5, 6], [7, 8]])

print(np.dot(matrix_a, matrix_b))  # Matrix multiplication
print(matrix_a @ matrix_b)          # Same as above (Python 3.5+)
print(matrix_a.T)                   # Transpose
```

### Indexing and Slicing

```python
import numpy as np

arr = np.array([[1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12]])

# Basic indexing
print(arr[0, 0])      # 1 (first element)
print(arr[1, 2])      # 7 (row 1, column 2)

# Slicing
print(arr[0, :])      # [1, 2, 3, 4] (first row)
print(arr[:, 0])      # [1, 5, 9] (first column)
print(arr[0:2, 1:3])  # [[2, 3], [6, 7]] (subarray)

# Boolean indexing
print(arr[arr > 5])   # [ 6  7  8  9 10 11 12]

# Fancy indexing
indices = [0, 2]
print(arr[indices])   # Rows 0 and 2
```

### Reshaping and Broadcasting

```python
import numpy as np

# Reshaping
arr = np.arange(12)
reshaped = arr.reshape(3, 4)
print(reshaped)
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]

# Flattening
flat = reshaped.flatten()  # or reshaped.ravel()

# Broadcasting - automatically expands dimensions
a = np.array([[1], [2], [3]])  # Shape: (3, 1)
b = np.array([10, 20, 30])      # Shape: (3,)
print(a + b)
# [[11 21 31]
#  [12 22 32]
#  [13 23 33]]
```

## Pandas: Data Manipulation

Pandas is essential for data handling and preprocessing.

### Creating DataFrames

```python
import pandas as pd

# From dictionary
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['NYC', 'LA', 'Chicago']
}
df = pd.DataFrame(data)
print(df)

# From CSV
df = pd.read_csv('data.csv')

# From Excel
df = pd.read_excel('data.xlsx')

# Basic info
print(df.head())       # First 5 rows
print(df.tail())       # Last 5 rows
print(df.shape)        # (rows, columns)
print(df.info())       # Column types and non-null counts
print(df.describe())   # Statistical summary
```

### Selecting Data

```python
import pandas as pd

df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie', 'David'],
    'age': [25, 30, 35, 28],
    'salary': [50000, 60000, 70000, 55000]
})

# Select columns
print(df['name'])                    # Single column (Series)
print(df[['name', 'age']])          # Multiple columns (DataFrame)

# Select rows by index
print(df.iloc[0])                    # First row
print(df.iloc[0:2])                  # First two rows
print(df.iloc[0, 1])                 # First row, second column

# Select by label
print(df.loc[0, 'name'])             # Row 0, column 'name'

# Conditional selection
print(df[df['age'] > 28])            # Rows where age > 28
print(df[(df['age'] > 25) & (df['salary'] > 55000)])
```

### Data Cleaning

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'A': [1, 2, np.nan, 4],
    'B': [5, np.nan, np.nan, 8],
    'C': ['x', 'y', 'z', 'x']
})

# Handle missing values
print(df.isnull().sum())          # Count missing per column
df_dropped = df.dropna()          # Remove rows with any NaN
df_filled = df.fillna(0)          # Fill NaN with 0
df_filled_mean = df.fillna(df.mean())  # Fill with column mean

# Remove duplicates
df_unique = df.drop_duplicates()

# Data types
df['A'] = df['A'].astype(float)

# Replace values
df['C'] = df['C'].replace('x', 'new_value')

# Rename columns
df = df.rename(columns={'A': 'column_a', 'B': 'column_b'})
```

### Grouping and Aggregation

```python
import pandas as pd

df = pd.DataFrame({
    'category': ['A', 'A', 'B', 'B', 'A'],
    'value': [10, 20, 30, 40, 50],
    'quantity': [1, 2, 3, 4, 5]
})

# Group by and aggregate
grouped = df.groupby('category').sum()
print(grouped)

# Multiple aggregations
agg = df.groupby('category').agg({
    'value': ['mean', 'sum', 'count'],
    'quantity': ['min', 'max']
})
print(agg)

# Pivot tables
pivot = df.pivot_table(
    values='value',
    index='category',
    aggfunc=['mean', 'sum']
)
```

### Merging DataFrames

```python
import pandas as pd

df1 = pd.DataFrame({
    'id': [1, 2, 3],
    'name': ['Alice', 'Bob', 'Charlie']
})

df2 = pd.DataFrame({
    'id': [2, 3, 4],
    'salary': [60000, 70000, 80000]
})

# Inner join (only matching ids)
merged = pd.merge(df1, df2, on='id', how='inner')

# Left join (all from df1)
merged_left = pd.merge(df1, df2, on='id', how='left')

# Concatenate
combined = pd.concat([df1, df1], ignore_index=True)
```

## Matplotlib: Data Visualization

Essential for visualizing data and model results.

### Basic Plots

```python
import matplotlib.pyplot as plt
import numpy as np

# Line plot
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, label='sin(x)', color='blue', linewidth=2)
plt.xlabel('X axis')
plt.ylabel('Y axis')
plt.title('Sine Wave')
plt.legend()
plt.grid(True)
plt.show()

# Scatter plot
x = np.random.randn(100)
y = x + np.random.randn(100) * 0.5

plt.figure(figsize=(8, 6))
plt.scatter(x, y, alpha=0.6, c='red')
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Scatter Plot')
plt.show()
```

### Multiple Plots

```python
import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Plot 1: Line
x = np.linspace(0, 10, 100)
axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title('Line Plot')

# Plot 2: Histogram
data = np.random.randn(1000)
axes[0, 1].hist(data, bins=30, edgecolor='black')
axes[0, 1].set_title('Histogram')

# Plot 3: Bar chart
categories = ['A', 'B', 'C', 'D']
values = [23, 45, 56, 78]
axes[1, 0].bar(categories, values, color='green')
axes[1, 0].set_title('Bar Chart')

# Plot 4: Pie chart
sizes = [30, 25, 25, 20]
axes[1, 1].pie(sizes, labels=categories, autopct='%1.1f%%')
axes[1, 1].set_title('Pie Chart')

plt.tight_layout()
plt.show()
```

### ML Visualization Examples

```python
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import confusion_matrix
import seaborn as sns

# Confusion Matrix
y_true = [0, 1, 0, 1, 0, 1, 0, 0, 1, 1]
y_pred = [0, 1, 0, 0, 0, 1, 1, 0, 1, 1]

cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.show()

# Learning Curves
epochs = range(1, 11)
train_loss = [0.9, 0.7, 0.5, 0.4, 0.35, 0.3, 0.28, 0.25, 0.23, 0.22]
val_loss = [0.95, 0.75, 0.6, 0.55, 0.52, 0.51, 0.52, 0.54, 0.56, 0.58]

plt.figure(figsize=(10, 6))
plt.plot(epochs, train_loss, 'b-', label='Training Loss')
plt.plot(epochs, val_loss, 'r-', label='Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.title('Learning Curves')
plt.legend()
plt.grid(True)
plt.show()
```

## Scikit-learn: Machine Learning

The most important library for traditional ML.

### Complete ML Pipeline

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import pandas as pd

# Load data
iris = load_iris()
X = pd.DataFrame(iris.data, columns=iris.feature_names)
y = iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Preprocessing
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(classification_report(y_test, y_pred))

# Cross-validation
cv_scores = cross_val_score(model, X, y, cv=5)
print(f"CV Scores: {cv_scores.mean():.3f} (+/- {cv_scores.std()*2:.3f})")
```

### Preprocessing Tools

```python
from sklearn.preprocessing import (
    StandardScaler, MinMaxScaler, LabelEncoder,
    OneHotEncoder, PolynomialFeatures
)
from sklearn.impute import SimpleImputer
import numpy as np

# Scaling
scaler = StandardScaler()  # Mean=0, Std=1
minmax = MinMaxScaler()    # Range [0, 1]

# Encoding categorical variables
le = LabelEncoder()
categories = ['cat', 'dog', 'bird', 'cat']
encoded = le.fit_transform(categories)  # [0, 1, 2, 0]

# One-hot encoding
ohe = OneHotEncoder(sparse=False)
encoded_onehot = ohe.fit_transform(np.array(categories).reshape(-1, 1))

# Handle missing values
imputer = SimpleImputer(strategy='mean')  # or 'median', 'most_frequent'
data_imputed = imputer.fit_transform(data_with_missing)

# Create polynomial features
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)
```

### Pipelines

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.svm import SVC

# Create pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=2)),
    ('classifier', SVC(kernel='rbf'))
])

# Use like a single model
pipeline.fit(X_train, y_train)
predictions = pipeline.predict(X_test)
accuracy = pipeline.score(X_test, y_test)
```

## Putting It All Together

Here's a complete example combining all libraries:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# Generate synthetic data
X, y = make_classification(
    n_samples=1000,
    n_features=10,
    n_informative=5,
    n_classes=2,
    random_state=42
)

# Convert to DataFrame
feature_names = [f'feature_{i}' for i in range(10)]
df = pd.DataFrame(X, columns=feature_names)
df['target'] = y

# Explore data
print("Dataset Shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())
print("\nStatistics:")
print(df.describe())

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

# Predictions
y_pred = model.predict(X_test_scaled)

# Evaluation
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Visualizations
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Feature Importance
importance = pd.Series(
    model.feature_importances_,
    index=feature_names
).sort_values(ascending=True)
axes[0].barh(importance.index, importance.values)
axes[0].set_title('Feature Importance')

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', ax=axes[1], cmap='Blues')
axes[1].set_title('Confusion Matrix')
axes[1].set_xlabel('Predicted')
axes[1].set_ylabel('Actual')

# Feature Distribution
axes[2].hist(X[:, 0], bins=30, alpha=0.5, label='Feature 0')
axes[2].hist(X[:, 1], bins=30, alpha=0.5, label='Feature 1')
axes[2].set_title('Feature Distribution')
axes[2].legend()

plt.tight_layout()
plt.show()
```

## Summary

| Library | Purpose | Key Functions |
|---------|---------|---------------|
| NumPy | Numerical computing | array, reshape, dot, mean |
| Pandas | Data manipulation | DataFrame, read_csv, groupby, merge |
| Matplotlib | Visualization | plot, scatter, hist, subplots |
| Scikit-learn | Machine learning | fit, predict, train_test_split, Pipeline |

## Exercises

1. Load a CSV file with Pandas and explore it
2. Create NumPy arrays and perform matrix operations
3. Build visualizations for a dataset
4. Create a complete ML pipeline with Scikit-learn

---

[Next: Your First ML Model →](/guide/ai/04-first-model)
