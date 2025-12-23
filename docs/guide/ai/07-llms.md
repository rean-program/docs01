# Working with LLMs

Large Language Models (LLMs) have revolutionized AI. This lesson covers how to use, integrate, and build applications with LLMs.

## What are LLMs?

Large Language Models are AI systems trained on massive text datasets to understand and generate human language. Examples include GPT-4, Claude, Llama, and Gemini.

```python
# Simple LLM interaction
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is machine learning?"}
    ]
)

print(response.choices[0].message.content)
```

## OpenAI API Basics

### Setup

```bash
pip install openai
```

```python
import os
from openai import OpenAI

# Set your API key
os.environ["OPENAI_API_KEY"] = "your-api-key-here"
# Or load from environment
client = OpenAI()
```

### Chat Completions

```python
from openai import OpenAI

client = OpenAI()

def chat(prompt, system_prompt="You are a helpful assistant."):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,  # Creativity (0-2)
        max_tokens=500    # Max response length
    )
    return response.choices[0].message.content

# Example
answer = chat("Explain neural networks in simple terms")
print(answer)
```

### Conversation History

```python
class ChatBot:
    def __init__(self, system_prompt="You are a helpful assistant."):
        self.client = OpenAI()
        self.messages = [
            {"role": "system", "content": system_prompt}
        ]

    def chat(self, user_message):
        # Add user message
        self.messages.append({"role": "user", "content": user_message})

        # Get response
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=self.messages
        )

        assistant_message = response.choices[0].message.content

        # Add assistant response to history
        self.messages.append({"role": "assistant", "content": assistant_message})

        return assistant_message

# Example conversation
bot = ChatBot("You are a Python tutor.")
print(bot.chat("What is a list in Python?"))
print(bot.chat("How do I add items to it?"))  # Bot remembers context
print(bot.chat("What about removing items?"))
```

## Prompt Engineering

Prompt engineering is the art of crafting effective prompts to get the best results from LLMs.

### Basic Techniques

```python
# 1. Be specific
bad_prompt = "Write about dogs"
good_prompt = "Write a 100-word paragraph about golden retrievers as family pets"

# 2. Provide context
prompt = """
Context: You are helping a beginner programmer.
Task: Explain what a variable is in Python.
Format: Use simple language and include a code example.
"""

# 3. Use examples (few-shot prompting)
prompt = """
Classify the sentiment of these reviews:

Review: "This product is amazing!"
Sentiment: Positive

Review: "Terrible quality, waste of money"
Sentiment: Negative

Review: "The delivery was fast and the item works well"
Sentiment:"""
```

### Advanced Prompting Patterns

```python
# Chain of Thought prompting
cot_prompt = """
Solve this step by step:

Question: If a store has 45 apples and sells 3/5 of them, how many are left?

Let's think through this step by step:
1. First, calculate 3/5 of 45
2. Then subtract from 45

Solution:
"""

# Role prompting
role_prompt = """
You are an expert Python developer with 10 years of experience.
Review this code and suggest improvements:

```python
def get_data(url):
    import requests
    r = requests.get(url)
    return r.json()
```
"""

# Output formatting
format_prompt = """
Extract information from this text and return as JSON:

Text: "John Smith is 30 years old and works at Google as a software engineer."

Return format:
{
    "name": "",
    "age": 0,
    "company": "",
    "role": ""
}
"""
```

### Prompt Templates

```python
from string import Template

# Create reusable templates
code_review_template = Template("""
You are an expert $language developer.

Review this code for:
1. Bugs and errors
2. Performance issues
3. Security vulnerabilities
4. Best practices

Code:
```$language
$code
```

Provide specific suggestions for improvement.
""")

# Use the template
prompt = code_review_template.substitute(
    language="Python",
    code="def process(data): return eval(data)"
)
```

## Function Calling / Tool Use

LLMs can call functions to interact with external systems.

```python
from openai import OpenAI
import json

client = OpenAI()

# Define available functions
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name, e.g., San Francisco"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            }
        }
    }
]

# Simulated function
def get_weather(location, unit="celsius"):
    # In reality, call a weather API
    return {"location": location, "temperature": 22, "unit": unit}

# Chat with function calling
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools,
    tool_choice="auto"
)

# Check if model wants to call a function
message = response.choices[0].message

if message.tool_calls:
    for tool_call in message.tool_calls:
        function_name = tool_call.function.name
        arguments = json.loads(tool_call.function.arguments)

        # Call the function
        if function_name == "get_weather":
            result = get_weather(**arguments)
            print(f"Weather result: {result}")
```

## RAG (Retrieval-Augmented Generation)

RAG combines LLMs with external knowledge bases for more accurate, up-to-date responses.

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

# Sample knowledge base
documents = [
    "Python was created by Guido van Rossum in 1991.",
    "Python is named after Monty Python's Flying Circus.",
    "Python 3.0 was released in December 2008.",
    "The Zen of Python can be viewed by typing 'import this'."
]

def get_embedding(text):
    """Get embedding for a text"""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def cosine_similarity(a, b):
    """Calculate cosine similarity between two vectors"""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def retrieve_relevant_docs(query, documents, top_k=2):
    """Find most relevant documents for a query"""
    query_embedding = get_embedding(query)

    # Get embeddings for all documents
    doc_embeddings = [get_embedding(doc) for doc in documents]

    # Calculate similarities
    similarities = [
        cosine_similarity(query_embedding, doc_emb)
        for doc_emb in doc_embeddings
    ]

    # Get top-k most similar
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    return [documents[i] for i in top_indices]

def rag_query(question):
    """Answer question using RAG"""
    # Retrieve relevant documents
    relevant_docs = retrieve_relevant_docs(question, documents)

    # Create prompt with context
    context = "\n".join(relevant_docs)
    prompt = f"""Answer the question based on the context below.

Context:
{context}

Question: {question}

Answer:"""

    # Generate response
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content

# Test RAG
answer = rag_query("Who created Python and when?")
print(answer)
```

## Using LangChain

LangChain simplifies building LLM applications.

```python
# pip install langchain langchain-openai

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

# Initialize model
llm = ChatOpenAI(model="gpt-4", temperature=0.7)

# Create prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that translates {input_language} to {output_language}."),
    ("human", "{text}")
])

# Create chain
chain = prompt | llm

# Run chain
result = chain.invoke({
    "input_language": "English",
    "output_language": "French",
    "text": "Hello, how are you?"
})

print(result.content)
```

### LangChain RAG Example

```python
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import RetrievalQA

# Sample documents
texts = [
    "The company was founded in 2020.",
    "Our main product is an AI assistant.",
    "We have 50 employees worldwide.",
    "Headquarters is in San Francisco."
]

# Create embeddings and vector store
embeddings = OpenAIEmbeddings()
text_splitter = CharacterTextSplitter(chunk_size=100, chunk_overlap=0)
docs = text_splitter.create_documents(texts)
vectorstore = FAISS.from_documents(docs, embeddings)

# Create QA chain
llm = ChatOpenAI(model="gpt-4")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# Ask questions
answer = qa_chain.run("Where is the company headquartered?")
print(answer)
```

## Streaming Responses

```python
from openai import OpenAI

client = OpenAI()

# Stream response for better UX
stream = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Write a short story about AI"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

## Building a Simple Chatbot

```python
from openai import OpenAI

class AIAssistant:
    def __init__(self, name="Assistant"):
        self.client = OpenAI()
        self.name = name
        self.messages = [
            {
                "role": "system",
                "content": f"""You are {name}, a helpful AI assistant.
                Be concise but thorough. If you don't know something, say so."""
            }
        ]

    def chat(self, user_input):
        self.messages.append({"role": "user", "content": user_input})

        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=self.messages,
            temperature=0.7,
            max_tokens=500
        )

        reply = response.choices[0].message.content
        self.messages.append({"role": "assistant", "content": reply})

        return reply

    def reset(self):
        """Clear conversation history"""
        self.messages = self.messages[:1]  # Keep system prompt

# Interactive chat
def main():
    assistant = AIAssistant("Claude")
    print(f"Chat with {assistant.name}. Type 'quit' to exit.\n")

    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            break

        response = assistant.chat(user_input)
        print(f"\n{assistant.name}: {response}\n")

if __name__ == "__main__":
    main()
```

## Best Practices

| Practice | Description |
|----------|-------------|
| Rate Limiting | Implement retry logic and respect API limits |
| Error Handling | Handle API errors gracefully |
| Cost Management | Track token usage and set budgets |
| Prompt Caching | Cache repeated prompts/responses |
| Security | Never expose API keys in code |

```python
import time
from openai import OpenAI, RateLimitError

client = OpenAI()

def chat_with_retry(prompt, max_retries=3):
    """Chat with exponential backoff retry"""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except RateLimitError:
            wait_time = 2 ** attempt
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)

    raise Exception("Max retries exceeded")
```

## Summary

| Concept | Description |
|---------|-------------|
| LLMs | Large language models for text understanding/generation |
| Prompt Engineering | Crafting effective prompts |
| Function Calling | LLMs invoking external functions |
| RAG | Combining LLMs with external knowledge |
| LangChain | Framework for LLM applications |

## Exercises

1. Build a chatbot with conversation memory
2. Implement a RAG system with your own documents
3. Create a function-calling assistant
4. Build a code review bot using prompt engineering

---

[Next: Fine-tuning Models →](/guide/ai/08-fine-tuning)
