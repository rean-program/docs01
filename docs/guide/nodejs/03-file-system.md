# File System in Node.js

The `fs` (File System) module is one of Node.js's most important built-in modules. It allows you to work with files and directories on your computer. In this tutorial, you'll learn how to read, write, create, and manage files.

## Introduction to the fs Module

```javascript
// Import the fs module
const fs = require('fs');

// Or with promises (recommended)
const fs = require('fs').promises;

// ES Modules
import fs from 'node:fs';
import fs from 'node:fs/promises';
```

## Synchronous vs Asynchronous

Node.js provides two ways to perform file operations:

```
┌─────────────────────────────────────────────────────────────┐
│              Synchronous vs Asynchronous                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Synchronous (Blocking)                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Task 1 ─────────►  Task 2 ─────────►  Task 3       │  │
│   │  (wait)             (wait)             (done)        │  │
│   └─────────────────────────────────────────────────────┘  │
│   Each task waits for the previous one to complete         │
│                                                             │
│   Asynchronous (Non-Blocking)                              │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Task 1 ────►                                        │  │
│   │  Task 2 ────►        All tasks run                   │  │
│   │  Task 3 ────►        simultaneously!                 │  │
│   └─────────────────────────────────────────────────────┘  │
│   Tasks run in parallel, much faster!                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Method | Function Name | Use Case |
|--------|--------------|----------|
| **Synchronous** | `fs.readFileSync()` | Simple scripts, startup code |
| **Callback** | `fs.readFile()` | Older Node.js code |
| **Promise** | `fs.promises.readFile()` | Modern async/await code |

::: tip Best Practice
Use the **Promise-based API** with `async/await` for most cases. It's cleaner and easier to handle errors.
:::

## Reading Files

### Read Entire File

**Synchronous:**
```javascript
const fs = require('fs');

try {
    const data = fs.readFileSync('example.txt', 'utf8');
    console.log(data);
} catch (error) {
    console.error('Error reading file:', error.message);
}
```

**Callback:**
```javascript
const fs = require('fs');

fs.readFile('example.txt', 'utf8', (error, data) => {
    if (error) {
        console.error('Error reading file:', error.message);
        return;
    }
    console.log(data);
});
```

**Promise (Recommended):**
```javascript
const fs = require('fs').promises;

async function readFile() {
    try {
        const data = await fs.readFile('example.txt', 'utf8');
        console.log(data);
    } catch (error) {
        console.error('Error reading file:', error.message);
    }
}

readFile();
```

### Understanding Encoding

```javascript
const fs = require('fs').promises;

// With encoding (returns string)
const text = await fs.readFile('file.txt', 'utf8');
console.log(typeof text);  // 'string'

// Without encoding (returns Buffer)
const buffer = await fs.readFile('file.txt');
console.log(typeof buffer);  // 'object' (Buffer)
console.log(buffer);         // <Buffer 48 65 6c 6c 6f ...>
console.log(buffer.toString('utf8')); // 'Hello ...'
```

### Reading JSON Files

```javascript
const fs = require('fs').promises;

async function readJSON(filepath) {
    try {
        const data = await fs.readFile(filepath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('File not found:', filepath);
        } else if (error instanceof SyntaxError) {
            console.error('Invalid JSON in file:', filepath);
        } else {
            console.error('Error reading file:', error.message);
        }
        return null;
    }
}

// Usage
const config = await readJSON('config.json');
console.log(config);
```

## Writing Files

### Write Entire File

**Synchronous:**
```javascript
const fs = require('fs');

try {
    fs.writeFileSync('output.txt', 'Hello, World!');
    console.log('File written successfully');
} catch (error) {
    console.error('Error writing file:', error.message);
}
```

**Promise (Recommended):**
```javascript
const fs = require('fs').promises;

async function writeFile() {
    try {
        await fs.writeFile('output.txt', 'Hello, World!');
        console.log('File written successfully');
    } catch (error) {
        console.error('Error writing file:', error.message);
    }
}

writeFile();
```

### Write with Options

```javascript
const fs = require('fs').promises;

// Write with specific encoding and mode
await fs.writeFile('output.txt', 'Hello!', {
    encoding: 'utf8',
    mode: 0o644,  // File permissions (Unix)
    flag: 'w'     // Write mode
});
```

### File Flags

| Flag | Description |
|------|-------------|
| `'r'` | Read. Error if doesn't exist |
| `'r+'` | Read and write. Error if doesn't exist |
| `'w'` | Write. Create or truncate |
| `'w+'` | Read and write. Create or truncate |
| `'a'` | Append. Create if doesn't exist |
| `'a+'` | Read and append. Create if doesn't exist |
| `'wx'` | Write. Fail if exists |
| `'ax'` | Append. Fail if exists |

### Writing JSON Files

```javascript
const fs = require('fs').promises;

async function writeJSON(filepath, data) {
    try {
        const json = JSON.stringify(data, null, 2); // Pretty print
        await fs.writeFile(filepath, json, 'utf8');
        console.log('JSON saved successfully');
    } catch (error) {
        console.error('Error saving JSON:', error.message);
    }
}

// Usage
const user = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
};

await writeJSON('user.json', user);
```

**Output (user.json):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

## Appending to Files

```javascript
const fs = require('fs').promises;

// Append text to file
await fs.appendFile('log.txt', 'New log entry\n');

// Multiple appends
async function log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    await fs.appendFile('app.log', logEntry);
}

await log('Application started');
await log('User logged in');
await log('Processing request');
```

## Checking if Files Exist

### Modern Approach (access)

```javascript
const fs = require('fs').promises;

async function fileExists(filepath) {
    try {
        await fs.access(filepath);
        return true;
    } catch {
        return false;
    }
}

// Usage
if (await fileExists('config.json')) {
    console.log('Config file found');
} else {
    console.log('Config file not found');
}
```

### Checking Permissions

```javascript
const fs = require('fs').promises;
const { constants } = require('fs');

// Check if file is readable
try {
    await fs.access('file.txt', constants.R_OK);
    console.log('File is readable');
} catch {
    console.log('File is not readable');
}

// Check if file is writable
try {
    await fs.access('file.txt', constants.W_OK);
    console.log('File is writable');
} catch {
    console.log('File is not writable');
}

// Check multiple permissions
try {
    await fs.access('file.txt', constants.R_OK | constants.W_OK);
    console.log('File is readable and writable');
} catch {
    console.log('File missing permissions');
}
```

## File Information (Stats)

```javascript
const fs = require('fs').promises;

async function getFileInfo(filepath) {
    try {
        const stats = await fs.stat(filepath);

        console.log('File Information:');
        console.log('─'.repeat(40));
        console.log(`Size: ${stats.size} bytes`);
        console.log(`Created: ${stats.birthtime}`);
        console.log(`Modified: ${stats.mtime}`);
        console.log(`Is File: ${stats.isFile()}`);
        console.log(`Is Directory: ${stats.isDirectory()}`);
        console.log(`Is Symbolic Link: ${stats.isSymbolicLink()}`);

        return stats;
    } catch (error) {
        console.error('Error getting file info:', error.message);
    }
}

await getFileInfo('example.txt');
```

**Output:**
```
File Information:
────────────────────────────────────────
Size: 1234 bytes
Created: 2024-01-15T10:30:00.000Z
Modified: 2024-01-16T14:22:00.000Z
Is File: true
Is Directory: false
Is Symbolic Link: false
```

### Stats Properties

| Property | Description |
|----------|-------------|
| `size` | Size in bytes |
| `birthtime` | Creation time |
| `mtime` | Last modified time |
| `atime` | Last access time |
| `mode` | File permissions |
| `isFile()` | Is a regular file? |
| `isDirectory()` | Is a directory? |
| `isSymbolicLink()` | Is a symbolic link? |

## Working with Directories

### Create Directory

```javascript
const fs = require('fs').promises;

// Create a single directory
await fs.mkdir('new-folder');

// Create nested directories (recursive)
await fs.mkdir('path/to/nested/folder', { recursive: true });
```

### Read Directory Contents

```javascript
const fs = require('fs').promises;
const path = require('path');

// List files in directory
const files = await fs.readdir('.');
console.log('Files:', files);
// ['file1.txt', 'file2.js', 'folder1', ...]

// Get detailed information
const entries = await fs.readdir('.', { withFileTypes: true });
for (const entry of entries) {
    const type = entry.isDirectory() ? '📁' : '📄';
    console.log(`${type} ${entry.name}`);
}
```

**Output:**
```
📄 index.js
📄 package.json
📁 node_modules
📁 src
📄 README.md
```

### List All Files Recursively

```javascript
const fs = require('fs').promises;
const path = require('path');

async function listFilesRecursive(dir, fileList = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Recurse into subdirectory
            await listFilesRecursive(fullPath, fileList);
        } else {
            fileList.push(fullPath);
        }
    }

    return fileList;
}

// Usage
const allFiles = await listFilesRecursive('./src');
console.log('All files:');
allFiles.forEach(file => console.log(`  ${file}`));
```

### Remove Directory

```javascript
const fs = require('fs').promises;

// Remove empty directory
await fs.rmdir('empty-folder');

// Remove directory with contents (Node.js 14.14+)
await fs.rm('folder-with-files', { recursive: true, force: true });
```

## Renaming and Moving Files

```javascript
const fs = require('fs').promises;

// Rename a file
await fs.rename('old-name.txt', 'new-name.txt');

// Move a file (same as rename with different path)
await fs.rename('file.txt', 'backup/file.txt');

// Rename a directory
await fs.rename('old-folder', 'new-folder');
```

## Deleting Files

```javascript
const fs = require('fs').promises;

// Delete a single file
await fs.unlink('file-to-delete.txt');

// Delete with error handling
async function deleteFile(filepath) {
    try {
        await fs.unlink(filepath);
        console.log(`Deleted: ${filepath}`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('File does not exist');
        } else {
            throw error;
        }
    }
}
```

## Copying Files

```javascript
const fs = require('fs').promises;

// Copy a file (Node.js 16.7+)
await fs.copyFile('source.txt', 'destination.txt');

// Copy with flags
const { constants } = require('fs');

// Fail if destination exists
await fs.copyFile('source.txt', 'dest.txt', constants.COPYFILE_EXCL);
```

### Copy Directory Recursively

```javascript
const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
    // Create destination directory
    await fs.mkdir(dest, { recursive: true });

    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

// Usage
await copyDir('source-folder', 'backup-folder');
```

## Watching for File Changes

```javascript
const fs = require('fs');

// Watch a file
const watcher = fs.watch('config.json', (eventType, filename) => {
    console.log(`Event: ${eventType}`);
    console.log(`File: ${filename}`);
});

// Watch a directory
fs.watch('./src', { recursive: true }, (eventType, filename) => {
    console.log(`${eventType}: ${filename}`);
});

// Stop watching
// watcher.close();
```

### Practical File Watcher

```javascript
const fs = require('fs');
const path = require('path');

function watchDirectory(dir, callback) {
    console.log(`Watching ${dir} for changes...`);

    const watcher = fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename) {
            const filepath = path.join(dir, filename);
            callback(eventType, filepath);
        }
    });

    return watcher;
}

// Usage
const watcher = watchDirectory('./src', (event, filepath) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${event}: ${filepath}`);
});

// Stop after 60 seconds
setTimeout(() => {
    watcher.close();
    console.log('Stopped watching');
}, 60000);
```

## Error Handling

Common file system errors:

| Error Code | Description |
|------------|-------------|
| `ENOENT` | No such file or directory |
| `EEXIST` | File already exists |
| `EACCES` | Permission denied |
| `EISDIR` | Is a directory (expected file) |
| `ENOTDIR` | Not a directory |
| `ENOTEMPTY` | Directory not empty |
| `EMFILE` | Too many open files |

### Comprehensive Error Handling

```javascript
const fs = require('fs').promises;

async function safeReadFile(filepath) {
    try {
        return await fs.readFile(filepath, 'utf8');
    } catch (error) {
        switch (error.code) {
            case 'ENOENT':
                console.error(`File not found: ${filepath}`);
                break;
            case 'EACCES':
                console.error(`Permission denied: ${filepath}`);
                break;
            case 'EISDIR':
                console.error(`Expected file, got directory: ${filepath}`);
                break;
            default:
                console.error(`Error reading file: ${error.message}`);
        }
        return null;
    }
}
```

## Practical Example: Simple File Manager

```javascript
const fs = require('fs').promises;
const path = require('path');

class FileManager {
    constructor(baseDir = '.') {
        this.baseDir = baseDir;
    }

    // Get full path
    getPath(filename) {
        return path.join(this.baseDir, filename);
    }

    // List files
    async list() {
        const entries = await fs.readdir(this.baseDir, { withFileTypes: true });
        return entries.map(entry => ({
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file'
        }));
    }

    // Read file
    async read(filename) {
        return await fs.readFile(this.getPath(filename), 'utf8');
    }

    // Write file
    async write(filename, content) {
        await fs.writeFile(this.getPath(filename), content, 'utf8');
    }

    // Delete file
    async delete(filename) {
        await fs.unlink(this.getPath(filename));
    }

    // Create directory
    async createDir(dirname) {
        await fs.mkdir(this.getPath(dirname), { recursive: true });
    }

    // Get file info
    async info(filename) {
        const stats = await fs.stat(this.getPath(filename));
        return {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            isDirectory: stats.isDirectory()
        };
    }

    // Search files by extension
    async findByExtension(ext) {
        const files = await this.list();
        return files.filter(f =>
            f.type === 'file' && f.name.endsWith(ext)
        );
    }
}

// Usage
const fm = new FileManager('./documents');

// List all files
const files = await fm.list();
console.log('Files:', files);

// Write a file
await fm.write('notes.txt', 'Hello, World!');

// Read a file
const content = await fm.read('notes.txt');
console.log('Content:', content);

// Find all .txt files
const textFiles = await fm.findByExtension('.txt');
console.log('Text files:', textFiles);
```

## Exercise: Build a Log Manager

Create a log manager that writes logs to daily files:

```javascript
const fs = require('fs').promises;
const path = require('path');

class LogManager {
    constructor(logDir = './logs') {
        this.logDir = logDir;
        this.init();
    }

    async init() {
        await fs.mkdir(this.logDir, { recursive: true });
    }

    getLogFilename() {
        const date = new Date().toISOString().split('T')[0];
        return path.join(this.logDir, `${date}.log`);
    }

    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    }

    async log(level, message) {
        const filename = this.getLogFilename();
        const formatted = this.formatMessage(level, message);
        await fs.appendFile(filename, formatted);
    }

    async info(message) {
        await this.log('info', message);
    }

    async warn(message) {
        await this.log('warn', message);
    }

    async error(message) {
        await this.log('error', message);
    }

    async getLogs(date) {
        const filename = path.join(this.logDir, `${date}.log`);
        try {
            return await fs.readFile(filename, 'utf8');
        } catch {
            return null;
        }
    }

    async clearOldLogs(daysToKeep = 7) {
        const files = await fs.readdir(this.logDir);
        const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

        for (const file of files) {
            const filepath = path.join(this.logDir, file);
            const stats = await fs.stat(filepath);

            if (stats.mtime.getTime() < cutoff) {
                await fs.unlink(filepath);
                console.log(`Deleted old log: ${file}`);
            }
        }
    }
}

// Usage
const logger = new LogManager();

await logger.info('Application started');
await logger.warn('Low memory');
await logger.error('Database connection failed');

// Get today's logs
const today = new Date().toISOString().split('T')[0];
const logs = await logger.getLogs(today);
console.log(logs);
```

## Summary

| Operation | Method |
|-----------|--------|
| **Read file** | `fs.readFile()` |
| **Write file** | `fs.writeFile()` |
| **Append to file** | `fs.appendFile()` |
| **Delete file** | `fs.unlink()` |
| **Rename/Move** | `fs.rename()` |
| **Copy file** | `fs.copyFile()` |
| **Create directory** | `fs.mkdir()` |
| **Read directory** | `fs.readdir()` |
| **Remove directory** | `fs.rmdir()` / `fs.rm()` |
| **File info** | `fs.stat()` |
| **Check exists** | `fs.access()` |
| **Watch changes** | `fs.watch()` |

## What's Next?

In the next chapter, we'll explore [Async Programming](/guide/nodejs/04-async) - callbacks, promises, and async/await in depth.

---

[Next: Async Programming →](/guide/nodejs/04-async)
