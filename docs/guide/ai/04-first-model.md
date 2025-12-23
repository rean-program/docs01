# Your First ML Model

Time to build your first Machine Learning model! We'll create a complete project from start to finish.

## Project: Titanic Survival Prediction

We'll predict whether a passenger survived the Titanic disaster based on their characteristics.

### Setup

```python
# Install required packages
# pip install pandas numpy scikit-learn matplotlib seaborn

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# For reproducibility
np.random.seed(42)
```

### Step 1: Load and Explore Data

```python
# Load the Titanic dataset
# You can download it from: https://www.kaggle.com/c/titanic/data
# Or use seaborn's built-in dataset

df = sns.load_dataset('titanic')

# First look at the data
print("Dataset Shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())

print("\nColumn Info:")
print(df.info())

print("\nStatistical Summary:")
print(df.describe())

print("\nMissing Values:")
print(df.isnull().sum())
```

### Step 2: Exploratory Data Analysis (EDA)

```python
# Survival rate
print(f"\nSurvival Rate: {df['survived'].mean():.2%}")

# Visualize survival by different features
fig, axes = plt.subplots(2, 3, figsize=(15, 10))

# Survival count
sns.countplot(x='survived', data=df, ax=axes[0, 0])
axes[0, 0].set_title('Survival Count')
axes[0, 0].set_xticklabels(['Died', 'Survived'])

# Survival by sex
sns.countplot(x='sex', hue='survived', data=df, ax=axes[0, 1])
axes[0, 1].set_title('Survival by Sex')

# Survival by class
sns.countplot(x='pclass', hue='survived', data=df, ax=axes[0, 2])
axes[0, 2].set_title('Survival by Class')

# Age distribution
sns.histplot(df['age'].dropna(), kde=True, ax=axes[1, 0])
axes[1, 0].set_title('Age Distribution')

# Survival by age
df['age_group'] = pd.cut(df['age'], bins=[0, 12, 20, 40, 60, 100],
                          labels=['Child', 'Teen', 'Adult', 'Middle', 'Senior'])
sns.countplot(x='age_group', hue='survived', data=df, ax=axes[1, 1])
axes[1, 1].set_title('Survival by Age Group')

# Fare distribution
sns.boxplot(x='survived', y='fare', data=df, ax=axes[1, 2])
axes[1, 2].set_title('Fare by Survival')

plt.tight_layout()
plt.show()

# Correlation heatmap
plt.figure(figsize=(10, 8))
numeric_cols = df.select_dtypes(include=[np.number]).columns
sns.heatmap(df[numeric_cols].corr(), annot=True, cmap='coolwarm', center=0)
plt.title('Correlation Heatmap')
plt.show()
```

### Step 3: Data Preprocessing

```python
# Create a copy for preprocessing
data = df.copy()

# Select features to use
features = ['pclass', 'sex', 'age', 'sibsp', 'parch', 'fare', 'embarked']
target = 'survived'

# Handle missing values
print("Missing values before:")
print(data[features].isnull().sum())

# Fill age with median
data['age'].fillna(data['age'].median(), inplace=True)

# Fill embarked with mode
data['embarked'].fillna(data['embarked'].mode()[0], inplace=True)

# Fill fare with median
data['fare'].fillna(data['fare'].median(), inplace=True)

print("\nMissing values after:")
print(data[features].isnull().sum())

# Encode categorical variables
le_sex = LabelEncoder()
data['sex'] = le_sex.fit_transform(data['sex'])  # male=1, female=0

le_embarked = LabelEncoder()
data['embarked'] = le_embarked.fit_transform(data['embarked'])

# Create feature matrix and target vector
X = data[features]
y = data[target]

print(f"\nFeature matrix shape: {X.shape}")
print(f"Target vector shape: {y.shape}")
```

### Step 4: Feature Engineering

```python
# Create new features
data['family_size'] = data['sibsp'] + data['parch'] + 1
data['is_alone'] = (data['family_size'] == 1).astype(int)

# Update features list
features_engineered = ['pclass', 'sex', 'age', 'sibsp', 'parch',
                       'fare', 'embarked', 'family_size', 'is_alone']

X = data[features_engineered]
y = data[target]

print("Features after engineering:")
print(X.head())
```

### Step 5: Split Data

```python
# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training set size: {len(X_train)}")
print(f"Test set size: {len(X_test)}")
print(f"\nTraining survival rate: {y_train.mean():.2%}")
print(f"Test survival rate: {y_test.mean():.2%}")
```

### Step 6: Scale Features

```python
# Scale numerical features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Convert back to DataFrame for easier handling
X_train_scaled = pd.DataFrame(X_train_scaled, columns=features_engineered)
X_test_scaled = pd.DataFrame(X_test_scaled, columns=features_engineered)
```

### Step 7: Train Models

```python
# Train multiple models and compare
models = {
    'Logistic Regression': LogisticRegression(random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42)
}

results = {}

for name, model in models.items():
    # Train
    model.fit(X_train_scaled, y_train)

    # Predict
    y_pred = model.predict(X_test_scaled)

    # Evaluate
    accuracy = accuracy_score(y_test, y_pred)
    results[name] = {
        'model': model,
        'accuracy': accuracy,
        'predictions': y_pred
    }

    print(f"\n{name}:")
    print(f"Accuracy: {accuracy:.4f}")

    # Cross-validation
    cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
    print(f"CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")
```

### Step 8: Evaluate Best Model

```python
# Use Random Forest as our best model
best_model = results['Random Forest']['model']
y_pred = results['Random Forest']['predictions']

# Detailed classification report
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=['Died', 'Survived']))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Died', 'Survived'],
            yticklabels=['Died', 'Survived'])
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()

# Feature importance
feature_importance = pd.DataFrame({
    'feature': features_engineered,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)

plt.figure(figsize=(10, 6))
sns.barplot(x='importance', y='feature', data=feature_importance)
plt.title('Feature Importance')
plt.xlabel('Importance')
plt.ylabel('Feature')
plt.show()

print("\nFeature Importance:")
print(feature_importance)
```

### Step 9: Make Predictions

```python
# Create a function to predict survival
def predict_survival(passenger_data):
    """
    Predict survival for a new passenger.

    passenger_data: dict with keys matching feature names
    """
    # Create DataFrame
    new_passenger = pd.DataFrame([passenger_data])

    # Encode categorical variables
    new_passenger['sex'] = le_sex.transform(new_passenger['sex'])
    new_passenger['embarked'] = le_embarked.transform(new_passenger['embarked'])

    # Ensure correct column order
    new_passenger = new_passenger[features_engineered]

    # Scale
    new_passenger_scaled = scaler.transform(new_passenger)

    # Predict
    prediction = best_model.predict(new_passenger_scaled)
    probability = best_model.predict_proba(new_passenger_scaled)

    return {
        'survived': bool(prediction[0]),
        'survival_probability': probability[0][1]
    }

# Test with a sample passenger
sample_passenger = {
    'pclass': 1,
    'sex': 'female',
    'age': 25,
    'sibsp': 1,
    'parch': 0,
    'fare': 100,
    'embarked': 'C',
    'family_size': 2,
    'is_alone': 0
}

result = predict_survival(sample_passenger)
print(f"\nSample Prediction:")
print(f"Would survive: {result['survived']}")
print(f"Survival probability: {result['survival_probability']:.2%}")
```

### Step 10: Save the Model

```python
import joblib

# Save the model and preprocessing objects
joblib.dump(best_model, 'titanic_model.pkl')
joblib.dump(scaler, 'titanic_scaler.pkl')
joblib.dump(le_sex, 'titanic_le_sex.pkl')
joblib.dump(le_embarked, 'titanic_le_embarked.pkl')

print("Model saved successfully!")

# Load the model later
loaded_model = joblib.load('titanic_model.pkl')
loaded_scaler = joblib.load('titanic_scaler.pkl')
```

## Complete Code Summary

```python
"""
Titanic Survival Prediction - Complete Pipeline
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import seaborn as sns
import joblib

# 1. Load Data
df = sns.load_dataset('titanic')

# 2. Preprocess
data = df.copy()
data['age'].fillna(data['age'].median(), inplace=True)
data['embarked'].fillna(data['embarked'].mode()[0], inplace=True)
data['fare'].fillna(data['fare'].median(), inplace=True)

# Encode
le_sex = LabelEncoder()
le_embarked = LabelEncoder()
data['sex'] = le_sex.fit_transform(data['sex'])
data['embarked'] = le_embarked.fit_transform(data['embarked'])

# Feature Engineering
data['family_size'] = data['sibsp'] + data['parch'] + 1
data['is_alone'] = (data['family_size'] == 1).astype(int)

# 3. Prepare Features
features = ['pclass', 'sex', 'age', 'sibsp', 'parch',
            'fare', 'embarked', 'family_size', 'is_alone']
X = data[features]
y = data['survived']

# 4. Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 5. Scale
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 6. Train
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# 7. Evaluate
y_pred = model.predict(X_test_scaled)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred))

# 8. Save
joblib.dump(model, 'titanic_model.pkl')
```

## Key Takeaways

| Step | Purpose | Tools |
|------|---------|-------|
| Data Loading | Get data into Python | pandas.read_csv |
| EDA | Understand the data | matplotlib, seaborn |
| Preprocessing | Clean and prepare data | fillna, LabelEncoder |
| Feature Engineering | Create useful features | pandas operations |
| Split Data | Separate train/test | train_test_split |
| Scaling | Normalize features | StandardScaler |
| Training | Build the model | model.fit() |
| Evaluation | Measure performance | accuracy_score, classification_report |
| Prediction | Use the model | model.predict() |
| Save | Persist the model | joblib |

## Exercises

1. Try different models (SVM, Gradient Boosting)
2. Create more features (title extraction from name)
3. Tune hyperparameters using GridSearchCV
4. Build a simple web interface for predictions

---

[Next: Neural Networks →](/guide/ai/05-neural-networks)
