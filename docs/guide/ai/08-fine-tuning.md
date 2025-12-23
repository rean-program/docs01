# Fine-tuning Models

Fine-tuning adapts pre-trained models to your specific use case. This lesson covers transfer learning, fine-tuning techniques, and best practices.

## What is Fine-tuning?

Fine-tuning takes a pre-trained model and continues training it on your specific dataset. This is faster and requires less data than training from scratch.

```
Pre-trained Model → Your Data → Fine-tuned Model
    (General)        (Specific)    (Specialized)
```

## Transfer Learning Basics

### Image Classification with Pre-trained CNN

```python
import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms, datasets
from torch.utils.data import DataLoader

# Load pre-trained ResNet
model = models.resnet50(pretrained=True)

# Freeze all layers
for param in model.parameters():
    param.requires_grad = False

# Replace the final layer
num_features = model.fc.in_features
model.fc = nn.Sequential(
    nn.Linear(num_features, 256),
    nn.ReLU(),
    nn.Dropout(0.5),
    nn.Linear(256, 10)  # 10 classes
)

# Only train the new layers
optimizer = torch.optim.Adam(model.fc.parameters(), lr=0.001)
```

### Gradual Unfreezing

```python
def unfreeze_layers(model, num_layers):
    """Unfreeze the last N layers for fine-tuning"""
    layers = list(model.children())

    # Freeze all layers first
    for param in model.parameters():
        param.requires_grad = False

    # Unfreeze last N layers
    for layer in layers[-num_layers:]:
        for param in layer.parameters():
            param.requires_grad = True

# Example: Start by training only the head
unfreeze_layers(model, 1)  # Only final layer

# After initial training, unfreeze more layers
unfreeze_layers(model, 3)  # Last 3 layers
```

## Fine-tuning OpenAI Models

### Preparing Training Data

```python
import json

# Training data format for chat models
training_data = [
    {
        "messages": [
            {"role": "system", "content": "You are a customer service assistant."},
            {"role": "user", "content": "How do I return a product?"},
            {"role": "assistant", "content": "To return a product, please visit our returns portal at returns.example.com and follow the instructions. You have 30 days from purchase to initiate a return."}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a customer service assistant."},
            {"role": "user", "content": "What's your refund policy?"},
            {"role": "assistant", "content": "We offer full refunds within 30 days of purchase for unused items. Refunds are processed within 5-7 business days after we receive the returned item."}
        ]
    }
]

# Save to JSONL format
with open('training_data.jsonl', 'w') as f:
    for item in training_data:
        f.write(json.dumps(item) + '\n')
```

### Fine-tuning with OpenAI API

```python
from openai import OpenAI

client = OpenAI()

# Upload training file
with open('training_data.jsonl', 'rb') as f:
    training_file = client.files.create(
        file=f,
        purpose='fine-tune'
    )

# Create fine-tuning job
job = client.fine_tuning.jobs.create(
    training_file=training_file.id,
    model="gpt-4o-mini-2024-07-18",
    hyperparameters={
        "n_epochs": 3
    }
)

print(f"Fine-tuning job created: {job.id}")

# Check job status
job_status = client.fine_tuning.jobs.retrieve(job.id)
print(f"Status: {job_status.status}")

# List events
events = client.fine_tuning.jobs.list_events(job.id)
for event in events.data:
    print(f"{event.created_at}: {event.message}")
```

### Using Fine-tuned Model

```python
# Use your fine-tuned model
response = client.chat.completions.create(
    model="ft:gpt-4o-mini-2024-07-18:org-name::job-id",  # Your fine-tuned model ID
    messages=[
        {"role": "system", "content": "You are a customer service assistant."},
        {"role": "user", "content": "How do I track my order?"}
    ]
)

print(response.choices[0].message.content)
```

## Fine-tuning Hugging Face Models

### Text Classification

```python
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    TrainingArguments, Trainer
)
from datasets import load_dataset
import numpy as np
from sklearn.metrics import accuracy_score

# Load dataset
dataset = load_dataset("imdb")

# Load pre-trained model and tokenizer
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=2
)

# Tokenize dataset
def tokenize_function(examples):
    return tokenizer(
        examples["text"],
        padding="max_length",
        truncation=True,
        max_length=512
    )

tokenized_datasets = dataset.map(tokenize_function, batched=True)

# Define metrics
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return {"accuracy": accuracy_score(labels, predictions)}

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=100,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True
)

# Create trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"].select(range(5000)),  # Subset
    eval_dataset=tokenized_datasets["test"].select(range(1000)),
    compute_metrics=compute_metrics
)

# Fine-tune
trainer.train()

# Save model
trainer.save_model("./fine-tuned-sentiment")
```

### Using LoRA for Efficient Fine-tuning

LoRA (Low-Rank Adaptation) reduces memory requirements dramatically.

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model, TaskType

# Load base model
model_name = "meta-llama/Llama-2-7b-hf"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    load_in_8bit=True,  # Quantization for memory efficiency
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Configure LoRA
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                    # Rank
    lora_alpha=32,           # Scaling
    lora_dropout=0.1,
    target_modules=["q_proj", "v_proj"]  # Which layers to adapt
)

# Apply LoRA
model = get_peft_model(model, lora_config)

# Check trainable parameters
model.print_trainable_parameters()
# Output: trainable params: 4,194,304 || all params: 6,742,609,920 || trainable%: 0.06%
```

### QLoRA (Quantized LoRA)

```python
from transformers import BitsAndBytesConfig
import torch

# Configure 4-bit quantization
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True
)

# Load model with quantization
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    device_map="auto"
)

# Apply LoRA on top of quantized model
model = get_peft_model(model, lora_config)
```

## Fine-tuning for Specific Tasks

### Named Entity Recognition (NER)

```python
from transformers import (
    AutoTokenizer, AutoModelForTokenClassification,
    TrainingArguments, Trainer, DataCollatorForTokenClassification
)
from datasets import load_dataset

# Load NER dataset
dataset = load_dataset("conll2003")

# Define label mapping
label_list = dataset["train"].features["ner_tags"].feature.names

# Load model
model = AutoModelForTokenClassification.from_pretrained(
    "bert-base-cased",
    num_labels=len(label_list)
)
tokenizer = AutoTokenizer.from_pretrained("bert-base-cased")

# Tokenize and align labels
def tokenize_and_align_labels(examples):
    tokenized = tokenizer(
        examples["tokens"],
        truncation=True,
        is_split_into_words=True
    )

    labels = []
    for i, label in enumerate(examples["ner_tags"]):
        word_ids = tokenized.word_ids(batch_index=i)
        label_ids = []
        previous_word_idx = None

        for word_idx in word_ids:
            if word_idx is None:
                label_ids.append(-100)
            elif word_idx != previous_word_idx:
                label_ids.append(label[word_idx])
            else:
                label_ids.append(-100)
            previous_word_idx = word_idx

        labels.append(label_ids)

    tokenized["labels"] = labels
    return tokenized

tokenized_dataset = dataset.map(tokenize_and_align_labels, batched=True)

# Train
data_collator = DataCollatorForTokenClassification(tokenizer)
trainer = Trainer(
    model=model,
    args=TrainingArguments(
        output_dir="./ner-model",
        num_train_epochs=3,
        per_device_train_batch_size=16
    ),
    train_dataset=tokenized_dataset["train"],
    data_collator=data_collator
)

trainer.train()
```

### Question Answering

```python
from transformers import (
    AutoModelForQuestionAnswering, AutoTokenizer,
    TrainingArguments, Trainer
)
from datasets import load_dataset

# Load SQuAD dataset
dataset = load_dataset("squad")

# Load model
model = AutoModelForQuestionAnswering.from_pretrained("bert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# Preprocess function
def preprocess_function(examples):
    questions = [q.strip() for q in examples["question"]]
    inputs = tokenizer(
        questions,
        examples["context"],
        max_length=384,
        truncation="only_second",
        return_offsets_mapping=True,
        padding="max_length"
    )

    # Find answer positions
    offset_mapping = inputs.pop("offset_mapping")
    answers = examples["answers"]
    start_positions = []
    end_positions = []

    for i, offset in enumerate(offset_mapping):
        answer = answers[i]
        start_char = answer["answer_start"][0]
        end_char = start_char + len(answer["text"][0])

        # Find token positions
        sequence_ids = inputs.sequence_ids(i)
        context_start = sequence_ids.index(1)
        context_end = len(sequence_ids) - 1 - sequence_ids[::-1].index(1)

        # Find start and end token positions
        start_pos = context_start
        end_pos = context_end

        for idx in range(context_start, context_end + 1):
            if offset[idx][0] <= start_char < offset[idx][1]:
                start_pos = idx
            if offset[idx][0] < end_char <= offset[idx][1]:
                end_pos = idx

        start_positions.append(start_pos)
        end_positions.append(end_pos)

    inputs["start_positions"] = start_positions
    inputs["end_positions"] = end_positions
    return inputs

tokenized_squad = dataset.map(preprocess_function, batched=True)
```

## Best Practices

### Data Quality

```python
def validate_training_data(data):
    """Validate training data quality"""
    issues = []

    for i, item in enumerate(data):
        # Check for empty fields
        if not item.get("input"):
            issues.append(f"Item {i}: Missing input")
        if not item.get("output"):
            issues.append(f"Item {i}: Missing output")

        # Check for length
        if len(item.get("input", "")) < 10:
            issues.append(f"Item {i}: Input too short")

        # Check for duplicates
        # ... additional checks

    return issues

# Clean and deduplicate data
def clean_data(data):
    seen = set()
    cleaned = []

    for item in data:
        key = (item["input"], item["output"])
        if key not in seen:
            seen.add(key)
            cleaned.append(item)

    return cleaned
```

### Hyperparameter Tuning

```python
from transformers import TrainingArguments

# Recommended starting points
training_args = TrainingArguments(
    output_dir="./output",

    # Learning rate
    learning_rate=2e-5,           # Start low for fine-tuning
    lr_scheduler_type="cosine",   # Smooth decay

    # Batch size
    per_device_train_batch_size=8,
    gradient_accumulation_steps=4, # Effective batch = 32

    # Training duration
    num_train_epochs=3,            # Usually 2-5 for fine-tuning
    warmup_ratio=0.1,              # 10% warmup

    # Regularization
    weight_decay=0.01,

    # Evaluation
    evaluation_strategy="steps",
    eval_steps=500,
    save_strategy="steps",
    save_steps=500,
    load_best_model_at_end=True,

    # Logging
    logging_steps=100,
    report_to="tensorboard"
)
```

### Evaluation

```python
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

def evaluate_model(model, test_loader, device):
    """Comprehensive model evaluation"""
    model.eval()
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for batch in test_loader:
            inputs = batch["input_ids"].to(device)
            labels = batch["labels"].to(device)

            outputs = model(inputs)
            preds = outputs.logits.argmax(dim=-1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    # Classification report
    print(classification_report(all_labels, all_preds))

    # Confusion matrix
    cm = confusion_matrix(all_labels, all_preds)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.show()

    return all_preds, all_labels
```

## Summary

| Technique | Use Case | Memory |
|-----------|----------|--------|
| Full Fine-tuning | Best performance, enough data | High |
| Feature Extraction | Small dataset, limited compute | Low |
| LoRA | Balance performance/efficiency | Medium |
| QLoRA | Large models, limited GPU | Low |

## Exercises

1. Fine-tune a BERT model for sentiment classification
2. Implement LoRA fine-tuning for a language model
3. Create a fine-tuned OpenAI model for your domain
4. Compare full fine-tuning vs LoRA performance

---

[Next: AI Agents →](/guide/ai/09-agents)
