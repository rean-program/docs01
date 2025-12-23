# File I/O

File Input/Output (I/O) allows your programs to read from and write to files. This is essential for data persistence, configuration, and working with external data.

::: info What You'll Learn
- Open and close files properly
- Read text and binary files
- Write and append to files
- Work with file paths
- Handle CSV and JSON files
- Use context managers for safety
:::

## Opening Files

```
┌─────────────────────────────────────────────────────────────────┐
│                    File Opening Modes                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Mode    Description              Creates?   Truncates?         │
│   ────    ───────────              ────────   ──────────         │
│   'r'     Read only (default)      No         No                 │
│   'w'     Write only               Yes        Yes                │
│   'a'     Append only              Yes        No                 │
│   'x'     Exclusive create         Yes        N/A                │
│   'r+'    Read and write           No         No                 │
│   'w+'    Write and read           Yes        Yes                │
│   'a+'    Append and read          Yes        No                 │
│                                                                  │
│   Add 'b' for binary mode: 'rb', 'wb', 'ab'                     │
│   Add 't' for text mode (default): 'rt', 'wt'                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Basic File Operations

```python
# Open and close manually (not recommended)
file = open("example.txt", "r")
content = file.read()
file.close()

# Using context manager (recommended!)
with open("example.txt", "r") as file:
    content = file.read()
# File automatically closed here

# Why use context managers?
# 1. Automatic cleanup (close)
# 2. Exception safe
# 3. Cleaner code
```

## Reading Files

### Read Entire File

```python
# Read entire file as string
with open("example.txt", "r") as file:
    content = file.read()
    print(content)

# Read with size limit
with open("example.txt", "r") as file:
    chunk = file.read(100)  # Read first 100 characters
```

### Read Lines

```python
# Read all lines as list
with open("example.txt", "r") as file:
    lines = file.readlines()
    for line in lines:
        print(line.strip())  # strip() removes \n

# Read single line
with open("example.txt", "r") as file:
    first_line = file.readline()
    second_line = file.readline()

# Iterate lines (memory efficient)
with open("example.txt", "r") as file:
    for line in file:
        print(line.strip())
```

### Reading Examples

```python
# Read and process lines
with open("data.txt", "r") as file:
    for line_num, line in enumerate(file, 1):
        print(f"Line {line_num}: {line.strip()}")

# Read into list comprehension
with open("numbers.txt", "r") as file:
    numbers = [int(line.strip()) for line in file]
    print(f"Sum: {sum(numbers)}")

# Read specific lines
def read_lines(filename, start, end):
    with open(filename, "r") as file:
        lines = file.readlines()
        return lines[start-1:end]

# Check if file exists before reading
from pathlib import Path

if Path("example.txt").exists():
    with open("example.txt", "r") as file:
        content = file.read()
else:
    print("File not found!")
```

## Writing Files

### Write Text

```python
# Write (overwrites existing content!)
with open("output.txt", "w") as file:
    file.write("Hello, World!\n")
    file.write("Second line\n")

# Write multiple lines
lines = ["Line 1", "Line 2", "Line 3"]
with open("output.txt", "w") as file:
    for line in lines:
        file.write(line + "\n")

# Using writelines()
with open("output.txt", "w") as file:
    file.writelines([line + "\n" for line in lines])
```

### Append to File

```python
# Append (adds to end of file)
with open("log.txt", "a") as file:
    file.write("New log entry\n")

# Append with timestamp
from datetime import datetime

def log_message(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open("log.txt", "a") as file:
        file.write(f"[{timestamp}] {message}\n")

log_message("Application started")
log_message("User logged in")
```

### Writing with Print

```python
# Use print() to write to file
with open("output.txt", "w") as file:
    print("Hello, World!", file=file)
    print("Number:", 42, file=file)
    print("List:", [1, 2, 3], file=file)
```

## File Paths

### Using pathlib (Recommended)

```python
from pathlib import Path

# Create path object
path = Path("folder/subfolder/file.txt")

# Path operations
print(path.name)        # file.txt
print(path.stem)        # file
print(path.suffix)      # .txt
print(path.parent)      # folder/subfolder
print(path.parts)       # ('folder', 'subfolder', 'file.txt')

# Check path
print(path.exists())    # True/False
print(path.is_file())   # True/False
print(path.is_dir())    # True/False

# Create directories
Path("new_folder").mkdir(exist_ok=True)
Path("a/b/c").mkdir(parents=True, exist_ok=True)

# Join paths
base = Path("folder")
full = base / "subfolder" / "file.txt"

# Get current directory
cwd = Path.cwd()
home = Path.home()

# List files
for file in Path(".").iterdir():
    print(file)

# Find files with pattern
for py_file in Path(".").glob("*.py"):
    print(py_file)

for all_py in Path(".").rglob("*.py"):  # Recursive
    print(all_py)
```

### Using os.path (Traditional)

```python
import os

# Join paths
path = os.path.join("folder", "subfolder", "file.txt")

# Path operations
print(os.path.basename(path))   # file.txt
print(os.path.dirname(path))    # folder/subfolder
print(os.path.splitext(path))   # ('folder/subfolder/file', '.txt')

# Check path
print(os.path.exists(path))
print(os.path.isfile(path))
print(os.path.isdir(path))

# Get size
print(os.path.getsize("file.txt"))

# Current directory
print(os.getcwd())
```

## Working with Directories

```python
from pathlib import Path
import os
import shutil

# Create directory
Path("new_dir").mkdir(exist_ok=True)

# Create nested directories
Path("a/b/c").mkdir(parents=True, exist_ok=True)

# List directory contents
for item in Path(".").iterdir():
    if item.is_file():
        print(f"File: {item}")
    elif item.is_dir():
        print(f"Dir: {item}")

# Copy file
shutil.copy("source.txt", "dest.txt")

# Move/rename file
shutil.move("old.txt", "new.txt")
# or
Path("old.txt").rename("new.txt")

# Delete file
Path("file.txt").unlink()
# or
os.remove("file.txt")

# Delete directory
Path("empty_dir").rmdir()           # Only empty dirs
shutil.rmtree("dir_with_content")   # Including contents
```

## Binary Files

```python
# Read binary file
with open("image.png", "rb") as file:
    data = file.read()
    print(f"File size: {len(data)} bytes")

# Write binary file
with open("output.bin", "wb") as file:
    file.write(b'\x00\x01\x02\x03')

# Copy binary file
with open("source.png", "rb") as src:
    with open("copy.png", "wb") as dst:
        dst.write(src.read())

# Read in chunks (for large files)
def copy_file(src_path, dst_path, chunk_size=8192):
    with open(src_path, "rb") as src:
        with open(dst_path, "wb") as dst:
            while True:
                chunk = src.read(chunk_size)
                if not chunk:
                    break
                dst.write(chunk)
```

## CSV Files

```python
import csv

# Write CSV
data = [
    ["Name", "Age", "City"],
    ["Alice", 25, "New York"],
    ["Bob", 30, "Los Angeles"],
    ["Charlie", 35, "Chicago"]
]

with open("data.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(data)

# Read CSV
with open("data.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# CSV with dictionaries
with open("data.csv", "w", newline="") as file:
    fieldnames = ["name", "age", "city"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerow({"name": "Alice", "age": 25, "city": "NYC"})
    writer.writerow({"name": "Bob", "age": 30, "city": "LA"})

# Read as dictionaries
with open("data.csv", "r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(f"{row['name']} is {row['age']} years old")
```

## JSON Files

```python
import json

# Write JSON
data = {
    "name": "Alice",
    "age": 25,
    "hobbies": ["reading", "coding", "gaming"],
    "address": {
        "city": "New York",
        "zip": "10001"
    }
}

with open("data.json", "w") as file:
    json.dump(data, file, indent=2)

# Read JSON
with open("data.json", "r") as file:
    data = json.load(file)
    print(data["name"])
    print(data["hobbies"])

# JSON string conversion
json_string = json.dumps(data, indent=2)
data = json.loads(json_string)

# Handle special types
from datetime import datetime

class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

data = {"timestamp": datetime.now()}
json_string = json.dumps(data, cls=DateEncoder)
```

## File Encoding

```python
# Specify encoding (important for non-ASCII)
with open("unicode.txt", "w", encoding="utf-8") as file:
    file.write("Hello, 世界! 🌍")

with open("unicode.txt", "r", encoding="utf-8") as file:
    content = file.read()

# Handle encoding errors
with open("file.txt", "r", encoding="utf-8", errors="ignore") as file:
    content = file.read()

# Common encodings
# utf-8      - Universal (recommended)
# ascii      - Basic English only
# latin-1    - Western European
# cp1252     - Windows Western European
```

## Error Handling

```python
from pathlib import Path

# Safe file reading
def read_file_safe(filename):
    try:
        with open(filename, "r") as file:
            return file.read()
    except FileNotFoundError:
        print(f"Error: {filename} not found")
        return None
    except PermissionError:
        print(f"Error: No permission to read {filename}")
        return None
    except IOError as e:
        print(f"Error reading file: {e}")
        return None

# Check before opening
def read_if_exists(filename):
    path = Path(filename)
    if not path.exists():
        return None
    if not path.is_file():
        return None
    return path.read_text()

# Using pathlib methods
path = Path("example.txt")
if path.exists():
    content = path.read_text()
    # path.write_text("new content")
```

## Temporary Files

```python
import tempfile

# Create temporary file
with tempfile.NamedTemporaryFile(mode='w', delete=False) as tmp:
    tmp.write("Temporary data")
    print(f"Temp file: {tmp.name}")

# Create temporary directory
with tempfile.TemporaryDirectory() as tmpdir:
    print(f"Temp dir: {tmpdir}")
    # Directory and contents deleted after block

# Get temp directory path
print(tempfile.gettempdir())
```

## Exercises

### Exercise 1: Log File Analyzer

Create a function that analyzes log files.

::: details Solution
```python
from datetime import datetime
from pathlib import Path
from collections import Counter

def analyze_log(filename):
    """Analyze a log file and return statistics"""
    if not Path(filename).exists():
        return {"error": "File not found"}

    stats = {
        "total_lines": 0,
        "error_count": 0,
        "warning_count": 0,
        "info_count": 0,
        "errors": [],
        "hourly_distribution": Counter()
    }

    with open(filename, "r") as file:
        for line in file:
            stats["total_lines"] += 1

            if "[ERROR]" in line:
                stats["error_count"] += 1
                stats["errors"].append(line.strip())
            elif "[WARNING]" in line:
                stats["warning_count"] += 1
            elif "[INFO]" in line:
                stats["info_count"] += 1

            # Extract hour if timestamp present
            if line.startswith("["):
                try:
                    time_str = line[1:20]
                    dt = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")
                    stats["hourly_distribution"][dt.hour] += 1
                except:
                    pass

    return stats

# Create sample log
sample_log = """[2024-01-15 10:23:45] [INFO] Application started
[2024-01-15 10:24:01] [INFO] User logged in
[2024-01-15 10:25:33] [WARNING] High memory usage
[2024-01-15 10:26:12] [ERROR] Database connection failed
[2024-01-15 11:00:00] [INFO] Retry successful
[2024-01-15 11:15:22] [ERROR] Timeout error
"""

with open("sample.log", "w") as f:
    f.write(sample_log)

result = analyze_log("sample.log")
print(f"Total lines: {result['total_lines']}")
print(f"Errors: {result['error_count']}")
print(f"Warnings: {result['warning_count']}")
```
:::

### Exercise 2: Config File Manager

Create a simple configuration file manager.

::: details Solution
```python
import json
from pathlib import Path

class ConfigManager:
    def __init__(self, filename):
        self.filename = filename
        self.config = self._load()

    def _load(self):
        """Load config from file"""
        if Path(self.filename).exists():
            with open(self.filename, "r") as f:
                return json.load(f)
        return {}

    def save(self):
        """Save config to file"""
        with open(self.filename, "w") as f:
            json.dump(self.config, f, indent=2)

    def get(self, key, default=None):
        """Get config value"""
        keys = key.split(".")
        value = self.config
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        return value

    def set(self, key, value):
        """Set config value"""
        keys = key.split(".")
        config = self.config
        for k in keys[:-1]:
            config = config.setdefault(k, {})
        config[keys[-1]] = value
        self.save()

    def delete(self, key):
        """Delete config value"""
        keys = key.split(".")
        config = self.config
        for k in keys[:-1]:
            if k in config:
                config = config[k]
            else:
                return
        if keys[-1] in config:
            del config[keys[-1]]
            self.save()

# Test
config = ConfigManager("app_config.json")
config.set("database.host", "localhost")
config.set("database.port", 5432)
config.set("app.debug", True)

print(config.get("database.host"))  # localhost
print(config.get("database.port"))  # 5432
print(config.get("missing", "default"))  # default
```
:::

### Exercise 3: File Backup System

Create a simple file backup system.

::: details Solution
```python
from pathlib import Path
from datetime import datetime
import shutil

class BackupManager:
    def __init__(self, backup_dir="backups"):
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(exist_ok=True)

    def backup(self, file_path):
        """Create a timestamped backup of a file"""
        file_path = Path(file_path)
        if not file_path.exists():
            return None

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{file_path.stem}_{timestamp}{file_path.suffix}"
        backup_path = self.backup_dir / backup_name

        shutil.copy2(file_path, backup_path)
        return backup_path

    def restore(self, backup_name, dest_path=None):
        """Restore a file from backup"""
        backup_path = self.backup_dir / backup_name
        if not backup_path.exists():
            return False

        if dest_path is None:
            # Extract original filename
            parts = backup_name.rsplit("_", 2)
            dest_path = parts[0] + Path(backup_name).suffix

        shutil.copy2(backup_path, dest_path)
        return True

    def list_backups(self, pattern="*"):
        """List all backups matching pattern"""
        return list(self.backup_dir.glob(pattern))

    def cleanup(self, keep_latest=5):
        """Keep only the latest N backups per file"""
        backups = sorted(self.backup_dir.iterdir(),
                        key=lambda p: p.stat().st_mtime,
                        reverse=True)

        file_counts = {}
        for backup in backups:
            base_name = backup.stem.rsplit("_", 2)[0]
            file_counts[base_name] = file_counts.get(base_name, 0) + 1
            if file_counts[base_name] > keep_latest:
                backup.unlink()
                print(f"Deleted old backup: {backup.name}")

# Test
backup = BackupManager()

# Create a test file
Path("test.txt").write_text("Original content")
backup.backup("test.txt")

Path("test.txt").write_text("Modified content")
backup.backup("test.txt")

print("Backups:", [b.name for b in backup.list_backups()])
```
:::

## Quick Reference

::: tip File I/O Cheat Sheet
```python
# Reading files
with open("file.txt", "r") as f:
    content = f.read()        # Entire file
    lines = f.readlines()     # List of lines
    line = f.readline()       # Single line

# Writing files
with open("file.txt", "w") as f:
    f.write("text")           # Write string
    f.writelines(lines)       # Write list

# Appending
with open("file.txt", "a") as f:
    f.write("more text")

# Binary mode
with open("file.bin", "rb") as f:  # Read binary
with open("file.bin", "wb") as f:  # Write binary

# Pathlib
from pathlib import Path
p = Path("file.txt")
p.exists()                    # Check exists
p.read_text()                 # Read content
p.write_text("content")       # Write content
p.parent                      # Parent directory
p.name                        # Filename
p.suffix                      # Extension

# JSON
import json
data = json.load(f)           # Read JSON
json.dump(data, f)            # Write JSON

# CSV
import csv
reader = csv.reader(f)
writer = csv.writer(f)
```
:::

## Common Mistakes

### ❌ WRONG: Not using context managers

```python
# ❌ WRONG - File may not be closed on error
file = open("data.txt", "r")
content = file.read()
# If error occurs here, file stays open!
file.close()

# ✓ CORRECT - Context manager ensures cleanup
with open("data.txt", "r") as file:
    content = file.read()
# File automatically closed, even if error occurs
```

### ❌ WRONG: Forgetting encoding for text files

```python
# ❌ WRONG - Default encoding may cause issues
with open("unicode_data.txt", "r") as f:
    content = f.read()  # May fail with non-ASCII

# ✓ CORRECT - Always specify encoding
with open("unicode_data.txt", "r", encoding="utf-8") as f:
    content = f.read()
```

### ❌ WRONG: Loading entire large files into memory

```python
# ❌ WRONG - Loads entire file into memory
with open("huge_file.txt", "r") as f:
    lines = f.readlines()  # May crash with large files
    for line in lines:
        process(line)

# ✓ CORRECT - Process line by line
with open("huge_file.txt", "r") as f:
    for line in f:  # Memory efficient iteration
        process(line)
```

### ❌ WRONG: Using write mode when you want to append

```python
# ❌ WRONG - Overwrites existing content!
with open("log.txt", "w") as f:
    f.write("New log entry\n")

# ✓ CORRECT - Append mode preserves existing content
with open("log.txt", "a") as f:
    f.write("New log entry\n")
```

### ❌ WRONG: Not checking if file exists before reading

```python
# ❌ WRONG - Crashes if file doesn't exist
with open("config.json", "r") as f:
    config = json.load(f)

# ✓ CORRECT - Check first or handle exception
from pathlib import Path

if Path("config.json").exists():
    with open("config.json", "r") as f:
        config = json.load(f)
else:
    config = {}  # Default config

# Or use try/except
try:
    with open("config.json", "r") as f:
        config = json.load(f)
except FileNotFoundError:
    config = {}
```

### ❌ WRONG: Hardcoding path separators

```python
# ❌ WRONG - Won't work on all operating systems
path = "folder\\subfolder\\file.txt"  # Windows only
path = "folder/subfolder/file.txt"    # May fail on Windows

# ✓ CORRECT - Use pathlib or os.path
from pathlib import Path
path = Path("folder") / "subfolder" / "file.txt"

# Or use os.path
import os
path = os.path.join("folder", "subfolder", "file.txt")
```

## Python vs JavaScript (Node.js)

| Operation | Python | JavaScript (Node.js) |
|-----------|--------|---------------------|
| Read file (sync) | `open(f).read()` | `fs.readFileSync(f)` |
| Read file (async) | `aiofiles.open(f)` | `fs.promises.readFile(f)` |
| Write file | `open(f, 'w').write(data)` | `fs.writeFileSync(f, data)` |
| Append file | `open(f, 'a').write(data)` | `fs.appendFileSync(f, data)` |
| Check exists | `Path(f).exists()` | `fs.existsSync(f)` |
| Delete file | `Path(f).unlink()` | `fs.unlinkSync(f)` |
| Create directory | `Path(d).mkdir()` | `fs.mkdirSync(d)` |
| List directory | `Path(d).iterdir()` | `fs.readdirSync(d)` |
| Read JSON | `json.load(f)` | `JSON.parse(fs.readFileSync(f))` |
| Write JSON | `json.dump(data, f)` | `fs.writeFileSync(f, JSON.stringify(data))` |
| Path join | `Path(a) / b` | `path.join(a, b)` |
| Get filename | `Path(f).name` | `path.basename(f)` |
| Get extension | `Path(f).suffix` | `path.extname(f)` |
| Get directory | `Path(f).parent` | `path.dirname(f)` |
| Absolute path | `Path(f).resolve()` | `path.resolve(f)` |
| Context manager | `with open(f) as file:` | N/A (use try/finally) |

## Real-World Examples

### Example 1: Configuration Manager with Auto-Reload

```python
import json
import time
from pathlib import Path
from typing import Any, Dict, Optional
from datetime import datetime

class ConfigManager:
    """
    Configuration manager with file watching and auto-reload.
    """

    def __init__(self, config_path: str, auto_reload: bool = True):
        self.config_path = Path(config_path)
        self.auto_reload = auto_reload
        self._config: Dict[str, Any] = {}
        self._last_modified: float = 0
        self._load()

    def _load(self) -> None:
        """Load configuration from file."""
        if not self.config_path.exists():
            self._config = {}
            self._save()
            return

        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                self._config = json.load(f)
            self._last_modified = self.config_path.stat().st_mtime
        except json.JSONDecodeError as e:
            print(f"Error loading config: {e}")
            self._config = {}

    def _save(self) -> None:
        """Save configuration to file."""
        self.config_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.config_path, 'w', encoding='utf-8') as f:
            json.dump(self._config, f, indent=2)
        self._last_modified = self.config_path.stat().st_mtime

    def _check_reload(self) -> None:
        """Check if config file changed and reload if needed."""
        if not self.auto_reload:
            return
        if not self.config_path.exists():
            return

        current_mtime = self.config_path.stat().st_mtime
        if current_mtime > self._last_modified:
            print(f"Config file changed, reloading...")
            self._load()

    def get(self, key: str, default: Any = None) -> Any:
        """Get config value with dot notation support."""
        self._check_reload()

        keys = key.split('.')
        value = self._config
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        return value

    def set(self, key: str, value: Any) -> None:
        """Set config value with dot notation support."""
        keys = key.split('.')
        config = self._config
        for k in keys[:-1]:
            config = config.setdefault(k, {})
        config[keys[-1]] = value
        self._save()

    def delete(self, key: str) -> bool:
        """Delete config value."""
        keys = key.split('.')
        config = self._config
        for k in keys[:-1]:
            if k not in config:
                return False
            config = config[k]

        if keys[-1] in config:
            del config[keys[-1]]
            self._save()
            return True
        return False

    def all(self) -> Dict[str, Any]:
        """Return all config values."""
        self._check_reload()
        return self._config.copy()


# Usage
config = ConfigManager("app_config.json")

# Set values
config.set("database.host", "localhost")
config.set("database.port", 5432)
config.set("database.credentials.user", "admin")
config.set("app.debug", True)
config.set("app.log_level", "INFO")

# Get values
print(f"DB Host: {config.get('database.host')}")
print(f"Debug: {config.get('app.debug')}")
print(f"Missing: {config.get('app.missing', 'default_value')}")

# View all
print(f"\nAll config: {json.dumps(config.all(), indent=2)}")
```

### Example 2: Log Rotation System

```python
import os
import gzip
import shutil
from pathlib import Path
from datetime import datetime
from typing import Optional

class LogRotator:
    """
    Log file rotation with compression and cleanup.
    """

    def __init__(self,
                 log_path: str,
                 max_size_mb: float = 10,
                 backup_count: int = 5,
                 compress: bool = True):
        self.log_path = Path(log_path)
        self.max_size_bytes = max_size_mb * 1024 * 1024
        self.backup_count = backup_count
        self.compress = compress

    def _get_backup_files(self):
        """Get list of existing backup files sorted by number."""
        pattern = f"{self.log_path.name}.*"
        backups = list(self.log_path.parent.glob(pattern))
        # Sort by modification time (newest first)
        return sorted(backups, key=lambda p: p.stat().st_mtime, reverse=True)

    def _compress_file(self, filepath: Path) -> Path:
        """Compress a file using gzip."""
        compressed_path = filepath.with_suffix(filepath.suffix + '.gz')
        with open(filepath, 'rb') as f_in:
            with gzip.open(compressed_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        filepath.unlink()
        return compressed_path

    def _rotate(self) -> None:
        """Perform log rotation."""
        if not self.log_path.exists():
            return

        # Generate backup name with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{self.log_path.name}.{timestamp}"
        backup_path = self.log_path.parent / backup_name

        # Rename current log to backup
        self.log_path.rename(backup_path)

        # Compress if enabled
        if self.compress:
            backup_path = self._compress_file(backup_path)

        print(f"Rotated: {self.log_path.name} -> {backup_path.name}")

        # Cleanup old backups
        self._cleanup_old_backups()

    def _cleanup_old_backups(self) -> None:
        """Remove old backup files exceeding backup_count."""
        backups = self._get_backup_files()
        if len(backups) > self.backup_count:
            for old_backup in backups[self.backup_count:]:
                old_backup.unlink()
                print(f"Deleted old backup: {old_backup.name}")

    def should_rotate(self) -> bool:
        """Check if rotation is needed."""
        if not self.log_path.exists():
            return False
        return self.log_path.stat().st_size >= self.max_size_bytes

    def write(self, message: str) -> None:
        """Write to log file with automatic rotation."""
        if self.should_rotate():
            self._rotate()

        # Ensure parent directory exists
        self.log_path.parent.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(self.log_path, 'a', encoding='utf-8') as f:
            f.write(f"[{timestamp}] {message}\n")

    def get_all_logs(self) -> str:
        """Read current log file and all backups."""
        content = []

        # Read backups (oldest first)
        for backup in reversed(self._get_backup_files()):
            if backup.suffix == '.gz':
                with gzip.open(backup, 'rt', encoding='utf-8') as f:
                    content.append(f.read())
            else:
                with open(backup, 'r', encoding='utf-8') as f:
                    content.append(f.read())

        # Read current log
        if self.log_path.exists():
            with open(self.log_path, 'r', encoding='utf-8') as f:
                content.append(f.read())

        return '\n'.join(content)


# Usage
logger = LogRotator(
    "logs/app.log",
    max_size_mb=0.001,  # Small for demo
    backup_count=3,
    compress=True
)

# Write some logs
for i in range(100):
    logger.write(f"Log message {i}: This is a test message with some content")

print(f"\nBackup files: {[f.name for f in logger._get_backup_files()]}")
```

### Example 3: Data Pipeline with Multiple Formats

```python
import csv
import json
from pathlib import Path
from typing import List, Dict, Any, Callable
from dataclasses import dataclass, asdict
from abc import ABC, abstractmethod

@dataclass
class Record:
    """Generic data record."""
    id: int
    name: str
    value: float
    tags: List[str]


class DataReader(ABC):
    """Abstract base class for data readers."""

    @abstractmethod
    def read(self, filepath: Path) -> List[Dict[str, Any]]:
        pass


class DataWriter(ABC):
    """Abstract base class for data writers."""

    @abstractmethod
    def write(self, filepath: Path, data: List[Dict[str, Any]]) -> None:
        pass


class JSONReader(DataReader):
    def read(self, filepath: Path) -> List[Dict[str, Any]]:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)


class JSONWriter(DataWriter):
    def write(self, filepath: Path, data: List[Dict[str, Any]]) -> None:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)


class CSVReader(DataReader):
    def read(self, filepath: Path) -> List[Dict[str, Any]]:
        with open(filepath, 'r', encoding='utf-8', newline='') as f:
            reader = csv.DictReader(f)
            data = []
            for row in reader:
                # Convert types
                row['id'] = int(row['id'])
                row['value'] = float(row['value'])
                row['tags'] = row['tags'].split(';') if row['tags'] else []
                data.append(row)
            return data


class CSVWriter(DataWriter):
    def write(self, filepath: Path, data: List[Dict[str, Any]]) -> None:
        if not data:
            return

        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            # Flatten tags list for CSV
            fieldnames = list(data[0].keys())
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for row in data:
                row_copy = row.copy()
                if 'tags' in row_copy and isinstance(row_copy['tags'], list):
                    row_copy['tags'] = ';'.join(row_copy['tags'])
                writer.writerow(row_copy)


class DataPipeline:
    """Data processing pipeline with format conversion."""

    READERS = {
        '.json': JSONReader(),
        '.csv': CSVReader(),
    }

    WRITERS = {
        '.json': JSONWriter(),
        '.csv': CSVWriter(),
    }

    def __init__(self):
        self.transformers: List[Callable] = []

    def add_transformer(self, func: Callable) -> 'DataPipeline':
        """Add a data transformation function."""
        self.transformers.append(func)
        return self

    def _get_reader(self, filepath: Path) -> DataReader:
        ext = filepath.suffix.lower()
        if ext not in self.READERS:
            raise ValueError(f"Unsupported input format: {ext}")
        return self.READERS[ext]

    def _get_writer(self, filepath: Path) -> DataWriter:
        ext = filepath.suffix.lower()
        if ext not in self.WRITERS:
            raise ValueError(f"Unsupported output format: {ext}")
        return self.WRITERS[ext]

    def process(self, input_path: str, output_path: str) -> int:
        """Process data from input to output with transformations."""
        input_file = Path(input_path)
        output_file = Path(output_path)

        # Read data
        reader = self._get_reader(input_file)
        data = reader.read(input_file)

        # Apply transformations
        for transformer in self.transformers:
            data = transformer(data)

        # Write data
        output_file.parent.mkdir(parents=True, exist_ok=True)
        writer = self._get_writer(output_file)
        writer.write(output_file, data)

        return len(data)


# Usage
# Create sample JSON data
sample_data = [
    {"id": 1, "name": "Alice", "value": 100.5, "tags": ["premium", "active"]},
    {"id": 2, "name": "Bob", "value": 50.0, "tags": ["basic"]},
    {"id": 3, "name": "Charlie", "value": 200.0, "tags": ["premium", "vip"]},
]

# Write sample data
Path("data").mkdir(exist_ok=True)
with open("data/input.json", 'w') as f:
    json.dump(sample_data, f, indent=2)

# Define transformers
def filter_premium(data):
    return [r for r in data if 'premium' in r.get('tags', [])]

def add_discount(data):
    for record in data:
        record['discounted_value'] = record['value'] * 0.9
    return data

def uppercase_names(data):
    for record in data:
        record['name'] = record['name'].upper()
    return data

# Create and run pipeline
pipeline = DataPipeline()
pipeline.add_transformer(filter_premium)
pipeline.add_transformer(add_discount)
pipeline.add_transformer(uppercase_names)

# JSON to CSV conversion with transformations
count = pipeline.process("data/input.json", "data/output.csv")
print(f"Processed {count} records")

# Read and display result
with open("data/output.csv", 'r') as f:
    print(f.read())
```

## Additional Exercises

### Exercise 4: Watchdog File Monitor

Create a file monitoring system that watches for changes.

::: details Solution
```python
import time
from pathlib import Path
from datetime import datetime
from typing import Callable, Dict, Set
from dataclasses import dataclass, field

@dataclass
class FileState:
    path: Path
    size: int
    modified: float
    exists: bool

@dataclass
class FileEvent:
    event_type: str  # 'created', 'modified', 'deleted'
    path: Path
    timestamp: datetime

class FileWatcher:
    """Simple file watcher that monitors directory for changes."""

    def __init__(self, watch_path: str, patterns: list = None):
        self.watch_path = Path(watch_path)
        self.patterns = patterns or ['*']
        self._file_states: Dict[Path, FileState] = {}
        self._callbacks: Dict[str, list] = {
            'created': [],
            'modified': [],
            'deleted': [],
        }

    def on(self, event_type: str, callback: Callable):
        """Register callback for event type."""
        if event_type in self._callbacks:
            self._callbacks[event_type].append(callback)
        return self

    def _get_current_files(self) -> Dict[Path, FileState]:
        """Get current state of all matching files."""
        states = {}
        for pattern in self.patterns:
            for path in self.watch_path.rglob(pattern):
                if path.is_file():
                    states[path] = FileState(
                        path=path,
                        size=path.stat().st_size,
                        modified=path.stat().st_mtime,
                        exists=True
                    )
        return states

    def _emit(self, event_type: str, path: Path):
        """Emit event to registered callbacks."""
        event = FileEvent(event_type, path, datetime.now())
        for callback in self._callbacks[event_type]:
            callback(event)

    def _check_changes(self):
        """Check for file changes."""
        current_files = self._get_current_files()
        current_paths = set(current_files.keys())
        known_paths = set(self._file_states.keys())

        # New files
        for path in current_paths - known_paths:
            self._emit('created', path)

        # Deleted files
        for path in known_paths - current_paths:
            self._emit('deleted', path)

        # Modified files
        for path in current_paths & known_paths:
            old_state = self._file_states[path]
            new_state = current_files[path]
            if new_state.modified > old_state.modified:
                self._emit('modified', path)

        self._file_states = current_files

    def watch(self, interval: float = 1.0, duration: float = None):
        """Start watching for changes."""
        self._file_states = self._get_current_files()
        print(f"Watching {self.watch_path} for changes...")

        start_time = time.time()
        try:
            while True:
                self._check_changes()
                time.sleep(interval)

                if duration and (time.time() - start_time) > duration:
                    break
        except KeyboardInterrupt:
            print("\nStopped watching.")


# Usage
def on_created(event):
    print(f"[CREATED] {event.path.name} at {event.timestamp}")

def on_modified(event):
    print(f"[MODIFIED] {event.path.name} at {event.timestamp}")

def on_deleted(event):
    print(f"[DELETED] {event.path.name} at {event.timestamp}")

# Create watcher
watcher = FileWatcher("./watched_folder", patterns=["*.txt", "*.log"])
watcher.on('created', on_created)
watcher.on('modified', on_modified)
watcher.on('deleted', on_deleted)

# Watch for 10 seconds (for demo)
# watcher.watch(interval=0.5, duration=10)
print("FileWatcher ready. Call watcher.watch() to start monitoring.")
```
:::

### Exercise 5: Database-like File Storage

Create a simple file-based database.

::: details Solution
```python
import json
import uuid
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
from dataclasses import dataclass, asdict
import threading

class FileDB:
    """Simple file-based JSON database."""

    def __init__(self, db_path: str):
        self.db_path = Path(db_path)
        self.db_path.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()

    def _collection_path(self, collection: str) -> Path:
        return self.db_path / f"{collection}.json"

    def _read_collection(self, collection: str) -> Dict[str, Any]:
        path = self._collection_path(collection)
        if not path.exists():
            return {}
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _write_collection(self, collection: str, data: Dict[str, Any]):
        path = self._collection_path(collection)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, default=str)

    def insert(self, collection: str, document: Dict[str, Any]) -> str:
        """Insert a document into collection."""
        with self._lock:
            data = self._read_collection(collection)

            # Generate ID if not provided
            doc_id = document.get('_id') or str(uuid.uuid4())[:8]
            document['_id'] = doc_id
            document['_created'] = datetime.now().isoformat()

            data[doc_id] = document
            self._write_collection(collection, data)
            return doc_id

    def find(self, collection: str, query: Dict[str, Any] = None) -> List[Dict]:
        """Find documents matching query."""
        data = self._read_collection(collection)

        if not query:
            return list(data.values())

        results = []
        for doc in data.values():
            if self._matches(doc, query):
                results.append(doc)
        return results

    def find_one(self, collection: str, query: Dict[str, Any]) -> Optional[Dict]:
        """Find single document matching query."""
        results = self.find(collection, query)
        return results[0] if results else None

    def _matches(self, doc: Dict, query: Dict) -> bool:
        """Check if document matches query."""
        for key, value in query.items():
            if key.startswith('$'):
                # Handle operators
                if key == '$gt':
                    pass  # Implement comparison operators
            elif key not in doc or doc[key] != value:
                return False
        return True

    def update(self, collection: str, query: Dict, update: Dict) -> int:
        """Update documents matching query."""
        with self._lock:
            data = self._read_collection(collection)
            count = 0

            for doc_id, doc in data.items():
                if self._matches(doc, query):
                    doc.update(update)
                    doc['_updated'] = datetime.now().isoformat()
                    count += 1

            self._write_collection(collection, data)
            return count

    def delete(self, collection: str, query: Dict) -> int:
        """Delete documents matching query."""
        with self._lock:
            data = self._read_collection(collection)
            to_delete = [
                doc_id for doc_id, doc in data.items()
                if self._matches(doc, query)
            ]

            for doc_id in to_delete:
                del data[doc_id]

            self._write_collection(collection, data)
            return len(to_delete)

    def count(self, collection: str, query: Dict = None) -> int:
        """Count documents matching query."""
        return len(self.find(collection, query))


# Usage
db = FileDB("./my_database")

# Insert documents
db.insert("users", {"name": "Alice", "age": 25, "role": "admin"})
db.insert("users", {"name": "Bob", "age": 30, "role": "user"})
db.insert("users", {"name": "Charlie", "age": 35, "role": "user"})

# Find all users
print("All users:")
for user in db.find("users"):
    print(f"  {user['name']} ({user['role']})")

# Find specific user
admin = db.find_one("users", {"role": "admin"})
print(f"\nAdmin: {admin['name']}")

# Update user
db.update("users", {"name": "Bob"}, {"age": 31})
bob = db.find_one("users", {"name": "Bob"})
print(f"\nBob's age: {bob['age']}")

# Count users
print(f"\nTotal users: {db.count('users')}")
print(f"Regular users: {db.count('users', {'role': 'user'})}")
```
:::

## Summary

| Operation | Code | Description |
|-----------|------|-------------|
| Read | `open("f", "r")` | Open for reading |
| Write | `open("f", "w")` | Open for writing |
| Append | `open("f", "a")` | Open for appending |
| Binary | `open("f", "rb")` | Binary mode |
| Context | `with open() as f:` | Auto-close |
| Read all | `f.read()` | Entire content |
| Read lines | `f.readlines()` | List of lines |
| Write | `f.write(s)` | Write string |
| JSON | `json.load/dump` | JSON files |
| CSV | `csv.reader/writer` | CSV files |

## Next Steps

Continue to [Modules](/guide/python/07-modules) to learn how to organize code into modules and packages.
