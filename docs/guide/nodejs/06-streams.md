# Streams in Node.js

Streams are one of the most powerful features in Node.js. They allow you to process data piece by piece, without loading everything into memory. In this tutorial, you'll learn how to use streams for efficient data handling.

## What are Streams?

Streams process data in chunks instead of loading everything at once.

```
┌─────────────────────────────────────────────────────────────┐
│                    Without Streams                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1GB File → [████████████████████████] → Memory (1GB)     │
│                      Load ALL at once                       │
│                      😱 Memory overflow!                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    With Streams                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1GB File → [█] → [█] → [█] → [█] → Memory (64KB)        │
│               ↓     ↓     ↓     ↓                          │
│             Process chunk by chunk                          │
│             ✅ Low memory usage!                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Types of Streams

```
┌─────────────────────────────────────────────────────────────┐
│                    Stream Types                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Readable          Writable          Duplex        Transform
│   ┌─────┐          ┌─────┐          ┌─────┐        ┌─────┐ │
│   │ → → │          │ ← ← │          │ ↔ ↔ │        │ → ⟳ │ │
│   └─────┘          └─────┘          └─────┘        └─────┘ │
│                                                             │
│   Read data        Write data       Read & Write   Transform│
│   (source)         (destination)    (both ways)    data     │
│                                                             │
│   Examples:        Examples:        Examples:      Examples:│
│   • fs.createRead  • fs.createWrite • net.Socket   • zlib   │
│   • http request   • http response  • TCP socket   • crypto │
│   • process.stdin  • process.stdout                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Type | Description | Example |
|------|-------------|---------|
| **Readable** | Source of data | File read, HTTP request |
| **Writable** | Destination for data | File write, HTTP response |
| **Duplex** | Both readable and writable | TCP socket |
| **Transform** | Modify data as it passes through | Compression, encryption |

## Readable Streams

### Creating a Readable Stream

```javascript
const fs = require('fs');

// Create a readable stream
const readStream = fs.createReadStream('large-file.txt', {
    encoding: 'utf8',
    highWaterMark: 64 * 1024 // 64KB chunks (default)
});

// Read data events
readStream.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes`);
    console.log('Chunk:', chunk.substring(0, 50) + '...');
});

readStream.on('end', () => {
    console.log('Finished reading');
});

readStream.on('error', (error) => {
    console.error('Error:', error.message);
});
```

### Reading Options

```javascript
const readStream = fs.createReadStream('file.txt', {
    encoding: 'utf8',       // Character encoding (null = Buffer)
    highWaterMark: 16384,   // Chunk size in bytes
    start: 0,               // Start position
    end: 100,               // End position (inclusive)
    autoClose: true,        // Auto close file descriptor
    emitClose: true         // Emit 'close' event
});
```

### Pausing and Resuming

```javascript
const readStream = fs.createReadStream('large-file.txt');
let totalBytes = 0;

readStream.on('data', (chunk) => {
    totalBytes += chunk.length;
    console.log(`Read ${totalBytes} bytes`);

    // Pause stream
    readStream.pause();

    // Process chunk (simulate async work)
    setTimeout(() => {
        console.log('Processing complete, resuming...');
        readStream.resume();
    }, 100);
});
```

## Writable Streams

### Creating a Writable Stream

```javascript
const fs = require('fs');

// Create a writable stream
const writeStream = fs.createWriteStream('output.txt');

// Write data
writeStream.write('Hello, ');
writeStream.write('World!\n');
writeStream.write('This is a stream.\n');

// End the stream (required!)
writeStream.end('Final line');

// Events
writeStream.on('finish', () => {
    console.log('All writes completed');
});

writeStream.on('error', (error) => {
    console.error('Write error:', error.message);
});
```

### Handling Backpressure

When writing faster than the destination can handle:

```javascript
const fs = require('fs');

const writeStream = fs.createWriteStream('output.txt');

function writeData() {
    let i = 0;
    const max = 1000000;

    function write() {
        let ok = true;

        while (i < max && ok) {
            i++;
            const data = `Line ${i}\n`;

            if (i === max) {
                // Last write
                writeStream.write(data);
            } else {
                // write() returns false if internal buffer is full
                ok = writeStream.write(data);
            }
        }

        if (i < max) {
            // Buffer is full, wait for drain
            console.log('Waiting for drain...');
            writeStream.once('drain', write);
        }
    }

    write();
}

writeStream.on('finish', () => {
    console.log('Done writing');
});

writeData();
```

## Piping Streams

The `pipe()` method connects streams together, handling backpressure automatically.

```
┌─────────────────────────────────────────────────────────────┐
│                    Stream Piping                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   readStream.pipe(writeStream)                              │
│                                                             │
│   ┌──────────┐         ┌──────────┐                        │
│   │ Readable │  ────►  │ Writable │                        │
│   │  Stream  │  pipe() │  Stream  │                        │
│   └──────────┘         └──────────┘                        │
│                                                             │
│   Data flows automatically from source to destination       │
│   Backpressure is handled automatically                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Basic Pipe

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

// Pipe data from input to output
readStream.pipe(writeStream);

writeStream.on('finish', () => {
    console.log('File copied!');
});
```

### Chaining Pipes (Transform Streams)

```javascript
const fs = require('fs');
const zlib = require('zlib');

// Read → Compress → Write
fs.createReadStream('input.txt')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('input.txt.gz'));

console.log('File compressed!');

// Read → Decompress → Write
fs.createReadStream('input.txt.gz')
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream('output.txt'));

console.log('File decompressed!');
```

### Multiple Pipes

```javascript
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');

// Read → Compress → Encrypt → Write
const readStream = fs.createReadStream('secret.txt');
const gzip = zlib.createGzip();
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
const writeStream = fs.createWriteStream('secret.txt.gz.enc');

readStream
    .pipe(gzip)
    .pipe(cipher)
    .pipe(writeStream);
```

## Transform Streams

Transform streams modify data as it passes through.

### Using Built-in Transform Streams

```javascript
const { Transform } = require('stream');
const fs = require('fs');

// Create uppercase transform
const upperCase = new Transform({
    transform(chunk, encoding, callback) {
        // Transform the chunk
        const upper = chunk.toString().toUpperCase();
        callback(null, upper);
    }
});

// Use it
fs.createReadStream('input.txt')
    .pipe(upperCase)
    .pipe(fs.createWriteStream('output.txt'));
```

### Creating Custom Transform Streams

```javascript
const { Transform } = require('stream');

// Line counter transform
class LineCounter extends Transform {
    constructor() {
        super();
        this.lineCount = 0;
    }

    _transform(chunk, encoding, callback) {
        const str = chunk.toString();
        this.lineCount += (str.match(/\n/g) || []).length;

        // Pass data through unchanged
        callback(null, chunk);
    }

    _flush(callback) {
        // Called when stream ends
        this.push(`\n--- Total lines: ${this.lineCount} ---\n`);
        callback();
    }
}

// Usage
const counter = new LineCounter();

fs.createReadStream('input.txt')
    .pipe(counter)
    .pipe(fs.createWriteStream('output.txt'));

counter.on('finish', () => {
    console.log(`Counted ${counter.lineCount} lines`);
});
```

### JSON Line Parser

```javascript
const { Transform } = require('stream');

class JSONLineParser extends Transform {
    constructor() {
        super({ objectMode: true }); // Output objects, not buffers
        this.buffer = '';
    }

    _transform(chunk, encoding, callback) {
        this.buffer += chunk.toString();

        const lines = this.buffer.split('\n');
        this.buffer = lines.pop(); // Keep incomplete line

        for (const line of lines) {
            if (line.trim()) {
                try {
                    const obj = JSON.parse(line);
                    this.push(obj);
                } catch (e) {
                    this.emit('error', new Error(`Invalid JSON: ${line}`));
                }
            }
        }

        callback();
    }

    _flush(callback) {
        if (this.buffer.trim()) {
            try {
                const obj = JSON.parse(this.buffer);
                this.push(obj);
            } catch (e) {
                this.emit('error', new Error(`Invalid JSON: ${this.buffer}`));
            }
        }
        callback();
    }
}

// Usage with JSON Lines file
const parser = new JSONLineParser();

fs.createReadStream('data.jsonl')
    .pipe(parser)
    .on('data', (obj) => {
        console.log('Parsed object:', obj);
    })
    .on('end', () => {
        console.log('Done parsing');
    });
```

## Duplex Streams

Duplex streams can both read and write independently.

```javascript
const { Duplex } = require('stream');

class Counter extends Duplex {
    constructor(max) {
        super();
        this.max = max;
        this.current = 0;
    }

    _read() {
        this.current++;
        if (this.current <= this.max) {
            this.push(String(this.current) + '\n');
        } else {
            this.push(null); // Signal end
        }
    }

    _write(chunk, encoding, callback) {
        console.log('Received:', chunk.toString().trim());
        callback();
    }
}

const counter = new Counter(5);

// Read from it
counter.on('data', (chunk) => {
    console.log('Read:', chunk.toString().trim());
});

// Write to it
counter.write('Hello\n');
counter.write('World\n');
```

## Pipeline API

The `pipeline()` function handles errors better than `.pipe()`:

```javascript
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// Old way with pipe (errors not handled well)
fs.createReadStream('input.txt')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('output.gz'));

// Better way with pipeline (Node.js 10+)
pipeline(
    fs.createReadStream('input.txt'),
    zlib.createGzip(),
    fs.createWriteStream('output.gz'),
    (error) => {
        if (error) {
            console.error('Pipeline failed:', error);
        } else {
            console.log('Pipeline succeeded');
        }
    }
);

// With async/await (Node.js 15+)
const { pipeline } = require('stream/promises');

async function compress() {
    try {
        await pipeline(
            fs.createReadStream('input.txt'),
            zlib.createGzip(),
            fs.createWriteStream('output.gz')
        );
        console.log('Compression complete');
    } catch (error) {
        console.error('Compression failed:', error);
    }
}
```

## Buffers

Buffers are used to handle binary data in Node.js.

### Creating Buffers

```javascript
// Create from string
const buf1 = Buffer.from('Hello, World!');

// Create from array
const buf2 = Buffer.from([72, 101, 108, 108, 111]);

// Create with size (filled with zeros)
const buf3 = Buffer.alloc(10);

// Create with size (uninitialized - faster but unsafe)
const buf4 = Buffer.allocUnsafe(10);
```

### Working with Buffers

```javascript
const buf = Buffer.from('Hello, World!');

// Get length
console.log(buf.length); // 13

// Convert to string
console.log(buf.toString());        // Hello, World!
console.log(buf.toString('utf8'));  // Hello, World!
console.log(buf.toString('hex'));   // 48656c6c6f2c20576f726c6421
console.log(buf.toString('base64')); // SGVsbG8sIFdvcmxkIQ==

// Access bytes
console.log(buf[0]);  // 72 (ASCII for 'H')
console.log(buf[1]);  // 101 (ASCII for 'e')

// Slice (creates a view, not a copy!)
const slice = buf.slice(0, 5);
console.log(slice.toString()); // Hello

// Copy
const copy = Buffer.alloc(5);
buf.copy(copy, 0, 0, 5);
console.log(copy.toString()); // Hello

// Concat
const combined = Buffer.concat([buf1, buf2]);
```

### Buffer vs String

```javascript
// Strings are immutable, Buffers are mutable
const str = 'Hello';
// str[0] = 'J'; // Doesn't work

const buf = Buffer.from('Hello');
buf[0] = 74; // ASCII for 'J'
console.log(buf.toString()); // 'Jello'
```

## Practical Examples

### 1. File Copy with Progress

```javascript
const fs = require('fs');
const path = require('path');

function copyWithProgress(source, destination) {
    return new Promise((resolve, reject) => {
        const stat = fs.statSync(source);
        const totalSize = stat.size;
        let copiedSize = 0;

        const readStream = fs.createReadStream(source);
        const writeStream = fs.createWriteStream(destination);

        readStream.on('data', (chunk) => {
            copiedSize += chunk.length;
            const percent = ((copiedSize / totalSize) * 100).toFixed(1);
            process.stdout.write(`\rProgress: ${percent}%`);
        });

        readStream.on('error', reject);
        writeStream.on('error', reject);

        writeStream.on('finish', () => {
            console.log('\nCopy complete!');
            resolve();
        });

        readStream.pipe(writeStream);
    });
}

// Usage
await copyWithProgress('large-file.zip', 'backup.zip');
```

### 2. Log File Processor

```javascript
const fs = require('fs');
const readline = require('readline');

async function processLogFile(filepath) {
    const stats = {
        total: 0,
        errors: 0,
        warnings: 0
    };

    const fileStream = fs.createReadStream(filepath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        stats.total++;

        if (line.includes('[ERROR]')) {
            stats.errors++;
        } else if (line.includes('[WARN]')) {
            stats.warnings++;
        }
    }

    return stats;
}

// Usage
const stats = await processLogFile('app.log');
console.log('Log Statistics:');
console.log(`  Total lines: ${stats.total}`);
console.log(`  Errors: ${stats.errors}`);
console.log(`  Warnings: ${stats.warnings}`);
```

### 3. CSV to JSON Converter

```javascript
const fs = require('fs');
const { Transform } = require('stream');

class CSVToJSON extends Transform {
    constructor() {
        super({ objectMode: true });
        this.headers = null;
        this.buffer = '';
        this.isFirst = true;
    }

    _transform(chunk, encoding, callback) {
        this.buffer += chunk.toString();
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop();

        for (const line of lines) {
            if (!line.trim()) continue;

            const values = line.split(',').map(v => v.trim());

            if (!this.headers) {
                this.headers = values;
            } else {
                const obj = {};
                this.headers.forEach((header, i) => {
                    obj[header] = values[i];
                });

                if (!this.isFirst) {
                    this.push(',\n');
                }
                this.push(JSON.stringify(obj, null, 2));
                this.isFirst = false;
            }
        }

        callback();
    }

    _flush(callback) {
        // Handle last line if exists
        if (this.buffer.trim() && this.headers) {
            const values = this.buffer.split(',').map(v => v.trim());
            const obj = {};
            this.headers.forEach((header, i) => {
                obj[header] = values[i];
            });

            if (!this.isFirst) {
                this.push(',\n');
            }
            this.push(JSON.stringify(obj, null, 2));
        }

        callback();
    }
}

// Usage
const csvToJson = new CSVToJSON();

const outputStream = fs.createWriteStream('output.json');
outputStream.write('[\n');

fs.createReadStream('data.csv')
    .pipe(csvToJson)
    .pipe(outputStream, { end: false });

csvToJson.on('end', () => {
    outputStream.write('\n]');
    outputStream.end();
    console.log('Conversion complete!');
});
```

### 4. HTTP File Download with Streams

```javascript
const https = require('https');
const fs = require('fs');

function downloadFile(url, destination) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination);

        https.get(url, (response) => {
            const totalSize = parseInt(response.headers['content-length'], 10);
            let downloadedSize = 0;

            response.on('data', (chunk) => {
                downloadedSize += chunk.length;
                const percent = ((downloadedSize / totalSize) * 100).toFixed(1);
                process.stdout.write(`\rDownloading: ${percent}%`);
            });

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log('\nDownload complete!');
                resolve();
            });
        }).on('error', (error) => {
            fs.unlink(destination, () => {}); // Delete incomplete file
            reject(error);
        });
    });
}

// Usage
await downloadFile(
    'https://example.com/large-file.zip',
    'downloaded-file.zip'
);
```

## Summary

| Stream Type | Use Case | Key Methods |
|-------------|----------|-------------|
| **Readable** | Read data | `.on('data')`, `.pipe()`, `.read()` |
| **Writable** | Write data | `.write()`, `.end()` |
| **Duplex** | Read & Write | Both readable and writable methods |
| **Transform** | Modify data | `_transform()`, `_flush()` |

### When to Use Streams

- **Use streams when:**
  - Working with large files
  - Real-time data processing
  - Network communication
  - Memory efficiency is important

- **Use regular methods when:**
  - Small files (< 1MB)
  - Simplicity is preferred
  - Random access is needed

## What's Next?

In the next chapter, we'll explore the [HTTP Module](/guide/nodejs/07-http) - how to create web servers and make HTTP requests in Node.js.

---

[Next: HTTP Module →](/guide/nodejs/07-http)
