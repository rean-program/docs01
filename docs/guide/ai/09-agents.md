# AI Agents

AI Agents are autonomous systems that can plan, reason, and take actions to accomplish goals. This lesson covers building intelligent agents.

## What are AI Agents?

An AI Agent is an LLM-powered system that can:
- Understand goals and break them into tasks
- Use tools to interact with the world
- Make decisions based on observations
- Learn from feedback and iterate

```
User Goal → Agent Reasoning → Tool Use → Observation → More Actions → Result
```

## Basic Agent Architecture

```python
from openai import OpenAI
import json

class SimpleAgent:
    def __init__(self, tools=None):
        self.client = OpenAI()
        self.tools = tools or []
        self.messages = []

    def think(self, user_input):
        """Main reasoning loop"""
        self.messages.append({"role": "user", "content": user_input})

        while True:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=self.messages,
                tools=self.tools if self.tools else None,
                tool_choice="auto" if self.tools else None
            )

            message = response.choices[0].message

            # If no tool calls, return the response
            if not message.tool_calls:
                self.messages.append({"role": "assistant", "content": message.content})
                return message.content

            # Execute tool calls
            self.messages.append(message)

            for tool_call in message.tool_calls:
                result = self.execute_tool(tool_call)
                self.messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(result)
                })

    def execute_tool(self, tool_call):
        """Execute a tool and return result"""
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)

        # Map to actual functions
        tool_map = {
            "search": self.search,
            "calculate": self.calculate,
            "get_weather": self.get_weather
        }

        if name in tool_map:
            return tool_map[name](**args)
        return f"Unknown tool: {name}"

    def search(self, query):
        """Simulated search tool"""
        return f"Search results for '{query}': [Result 1, Result 2, Result 3]"

    def calculate(self, expression):
        """Calculator tool"""
        try:
            return eval(expression)
        except:
            return "Error evaluating expression"

    def get_weather(self, location):
        """Weather tool"""
        return f"Weather in {location}: 72°F, Sunny"
```

## ReAct Pattern (Reasoning + Acting)

ReAct combines reasoning and action in a loop.

```python
class ReActAgent:
    def __init__(self):
        self.client = OpenAI()
        self.tools = self._define_tools()

    def _define_tools(self):
        return [
            {
                "type": "function",
                "function": {
                    "name": "search",
                    "description": "Search the web for information",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Search query"}
                        },
                        "required": ["query"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "calculator",
                    "description": "Perform mathematical calculations",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "expression": {"type": "string", "description": "Math expression"}
                        },
                        "required": ["expression"]
                    }
                }
            }
        ]

    def run(self, task, max_iterations=10):
        """Execute ReAct loop"""
        system_prompt = """You are an AI assistant that solves problems step by step.

For each step:
1. Thought: Reason about what to do next
2. Action: Use a tool if needed
3. Observation: Review the result
4. Repeat until you can provide the final answer

Always explain your reasoning before taking action."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": task}
        ]

        for i in range(max_iterations):
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                tools=self.tools,
                tool_choice="auto"
            )

            message = response.choices[0].message

            # Check if done
            if not message.tool_calls:
                return message.content

            # Process tool calls
            messages.append(message)
            print(f"\n--- Iteration {i+1} ---")
            print(f"Thought: {message.content}")

            for tool_call in message.tool_calls:
                result = self._execute_tool(tool_call)
                print(f"Action: {tool_call.function.name}({tool_call.function.arguments})")
                print(f"Observation: {result}")

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(result)
                })

        return "Max iterations reached"

    def _execute_tool(self, tool_call):
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)

        if name == "search":
            return f"Results for '{args['query']}': Python was created by Guido van Rossum in 1991."
        elif name == "calculator":
            try:
                return eval(args["expression"])
            except:
                return "Error"
        return "Unknown tool"

# Example usage
agent = ReActAgent()
result = agent.run("What year was Python created, and how many years ago was that?")
print(f"\nFinal Answer: {result}")
```

## Multi-Tool Agent

```python
import subprocess
import requests
from datetime import datetime

class MultiToolAgent:
    def __init__(self):
        self.client = OpenAI()
        self.tools = self._define_tools()
        self.tool_functions = {
            "run_python": self.run_python,
            "read_file": self.read_file,
            "write_file": self.write_file,
            "web_search": self.web_search,
            "get_current_time": self.get_current_time
        }

    def _define_tools(self):
        return [
            {
                "type": "function",
                "function": {
                    "name": "run_python",
                    "description": "Execute Python code and return the output",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string", "description": "Python code to execute"}
                        },
                        "required": ["code"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "read_file",
                    "description": "Read contents of a file",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "path": {"type": "string", "description": "File path"}
                        },
                        "required": ["path"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "write_file",
                    "description": "Write content to a file",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "path": {"type": "string", "description": "File path"},
                            "content": {"type": "string", "description": "Content to write"}
                        },
                        "required": ["path", "content"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_current_time",
                    "description": "Get the current date and time",
                    "parameters": {"type": "object", "properties": {}}
                }
            }
        ]

    def run_python(self, code):
        """Execute Python code safely"""
        try:
            result = subprocess.run(
                ["python", "-c", code],
                capture_output=True,
                text=True,
                timeout=10
            )
            return result.stdout or result.stderr
        except Exception as e:
            return f"Error: {str(e)}"

    def read_file(self, path):
        """Read a file"""
        try:
            with open(path, 'r') as f:
                return f.read()
        except Exception as e:
            return f"Error: {str(e)}"

    def write_file(self, path, content):
        """Write to a file"""
        try:
            with open(path, 'w') as f:
                f.write(content)
            return f"Successfully wrote to {path}"
        except Exception as e:
            return f"Error: {str(e)}"

    def get_current_time(self):
        """Get current time"""
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def execute(self, task):
        """Execute a task"""
        messages = [
            {"role": "system", "content": "You are a helpful assistant with access to tools."},
            {"role": "user", "content": task}
        ]

        while True:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                tools=self.tools
            )

            message = response.choices[0].message

            if not message.tool_calls:
                return message.content

            messages.append(message)

            for tool_call in message.tool_calls:
                name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)

                print(f"Executing: {name}({args})")
                result = self.tool_functions[name](**args)
                print(f"Result: {result[:100]}...")

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(result)
                })
```

## Planning Agent

An agent that creates and follows plans.

```python
class PlanningAgent:
    def __init__(self):
        self.client = OpenAI()

    def create_plan(self, goal):
        """Create a step-by-step plan"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": """Create a detailed step-by-step plan to achieve the goal.
                Return as a numbered list. Each step should be specific and actionable."""},
                {"role": "user", "content": f"Goal: {goal}"}
            ]
        )
        return response.choices[0].message.content

    def execute_step(self, step, context):
        """Execute a single step of the plan"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Execute the given step and provide the result."},
                {"role": "user", "content": f"Context: {context}\n\nStep to execute: {step}"}
            ]
        )
        return response.choices[0].message.content

    def run(self, goal):
        """Run the planning agent"""
        print(f"Goal: {goal}\n")

        # Create plan
        plan = self.create_plan(goal)
        print(f"Plan:\n{plan}\n")

        # Parse steps
        steps = [s.strip() for s in plan.split('\n') if s.strip() and s[0].isdigit()]

        # Execute each step
        context = f"Goal: {goal}"
        results = []

        for i, step in enumerate(steps):
            print(f"\nExecuting step {i+1}...")
            result = self.execute_step(step, context)
            results.append(result)
            context += f"\n\nStep {i+1} result: {result}"
            print(f"Result: {result[:200]}...")

        return results

# Usage
agent = PlanningAgent()
results = agent.run("Create a Python function to analyze sentiment of text")
```

## LangChain Agents

LangChain provides a framework for building agents.

```python
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.tools import Tool, tool
from langchain import hub

# Define custom tools
@tool
def calculator(expression: str) -> str:
    """Useful for doing math calculations."""
    try:
        return str(eval(expression))
    except:
        return "Error evaluating expression"

@tool
def get_word_length(word: str) -> int:
    """Returns the length of a word."""
    return len(word)

# Create tools list
tools = [calculator, get_word_length]

# Initialize model
llm = ChatOpenAI(model="gpt-4", temperature=0)

# Get prompt template
prompt = hub.pull("hwchase17/openai-tools-agent")

# Create agent
agent = create_openai_tools_agent(llm, tools, prompt)

# Create executor
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True
)

# Run agent
result = agent_executor.invoke({
    "input": "What is 25 * 4 + 10? Also, how many characters are in 'artificial'?"
})
print(result["output"])
```

## Memory and State

```python
from langchain.memory import ConversationBufferMemory, ConversationSummaryMemory

class StatefulAgent:
    def __init__(self):
        self.client = OpenAI()
        self.memory = []
        self.state = {}

    def remember(self, key, value):
        """Store information in state"""
        self.state[key] = value

    def recall(self, key):
        """Retrieve information from state"""
        return self.state.get(key)

    def chat(self, user_input):
        """Chat with memory"""
        # Add context from state
        context = f"Current state: {json.dumps(self.state)}" if self.state else ""

        messages = [
            {"role": "system", "content": f"You are a helpful assistant. {context}"}
        ] + self.memory + [
            {"role": "user", "content": user_input}
        ]

        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=messages
        )

        assistant_message = response.choices[0].message.content

        # Update memory
        self.memory.append({"role": "user", "content": user_input})
        self.memory.append({"role": "assistant", "content": assistant_message})

        # Trim memory if too long
        if len(self.memory) > 20:
            self.memory = self.memory[-20:]

        return assistant_message
```

## Autonomous Agent Example

```python
class AutonomousAgent:
    """An agent that can work autonomously towards a goal"""

    def __init__(self, goal):
        self.client = OpenAI()
        self.goal = goal
        self.completed_tasks = []
        self.current_task = None

    def generate_tasks(self):
        """Generate tasks to achieve the goal"""
        prompt = f"""
Goal: {self.goal}

Completed tasks: {self.completed_tasks}

Generate the next 3 tasks needed to achieve this goal.
Return as a JSON array of strings.
"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        result = json.loads(response.choices[0].message.content)
        return result.get("tasks", [])

    def execute_task(self, task):
        """Execute a single task"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Execute the task and provide detailed output."},
                {"role": "user", "content": f"Task: {task}"}
            ]
        )
        return response.choices[0].message.content

    def check_completion(self):
        """Check if goal is achieved"""
        prompt = f"""
Goal: {self.goal}
Completed tasks: {self.completed_tasks}

Is the goal achieved? Respond with JSON: {{"achieved": true/false, "reason": "explanation"}}
"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        result = json.loads(response.choices[0].message.content)
        return result.get("achieved", False)

    def run(self, max_iterations=10):
        """Run the autonomous agent"""
        for i in range(max_iterations):
            print(f"\n=== Iteration {i+1} ===")

            # Check if done
            if self.check_completion():
                print("Goal achieved!")
                return True

            # Generate and execute tasks
            tasks = self.generate_tasks()

            for task in tasks[:1]:  # Execute one task at a time
                print(f"\nExecuting: {task}")
                result = self.execute_task(task)
                print(f"Result: {result[:200]}...")
                self.completed_tasks.append({"task": task, "result": result})

        print("Max iterations reached")
        return False
```

## Summary

| Pattern | Description | Use Case |
|---------|-------------|----------|
| ReAct | Reasoning + Acting loop | General problem solving |
| Planning | Create then execute plan | Complex multi-step tasks |
| Multi-tool | Multiple capabilities | Versatile assistants |
| Autonomous | Self-directed execution | Long-running tasks |

## Exercises

1. Build a ReAct agent with custom tools
2. Create a planning agent for code generation
3. Implement an agent with persistent memory
4. Build an autonomous research agent

---

[Next: Production AI →](/guide/ai/10-production)
