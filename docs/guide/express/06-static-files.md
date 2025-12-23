# Static Files in Express.js

Static files are files that clients download as they are from the server - CSS, JavaScript, images, fonts, and more. Express provides built-in middleware to serve these files efficiently.

## Basic Setup

### express.static()

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve files from 'public' directory
app.use(express.static('public'));

app.listen(3000);
```

With this setup, files in `public/` are accessible:
- `public/css/style.css` → `http://localhost:3000/css/style.css`
- `public/js/main.js` → `http://localhost:3000/js/main.js`
- `public/images/logo.png` → `http://localhost:3000/images/logo.png`

### Using Absolute Paths

```javascript
// Recommended: use absolute paths
app.use(express.static(path.join(__dirname, 'public')));
```

## Virtual Path Prefix

Add a prefix to static file URLs:

```javascript
// Files accessible at /static/*
app.use('/static', express.static('public'));

// public/css/style.css → http://localhost:3000/static/css/style.css
```

```javascript
// Multiple prefixes
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/images', express.static('public/images'));
```

## Multiple Static Directories

Express looks for files in the order you define static directories:

```javascript
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('assets'));
```

## Project Structure

```
project/
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── components/
│   │       └── buttons.css
│   ├── js/
│   │   ├── main.js
│   │   └── utils/
│   │       └── helpers.js
│   ├── images/
│   │   ├── logo.png
│   │   └── hero.jpg
│   ├── fonts/
│   │   └── roboto.woff2
│   └── favicon.ico
├── uploads/           # User uploads
├── views/
├── app.js
└── package.json
```

## Static File Options

```javascript
app.use(express.static('public', {
  // Enable/disable dotfiles (e.g., .htaccess)
  dotfiles: 'ignore', // 'allow', 'deny', 'ignore'

  // Enable/disable etag generation
  etag: true,

  // Set file extension fallbacks
  extensions: ['html', 'htm'],

  // Default file for directories
  index: 'index.html', // or false to disable

  // Enable/disable Last-Modified header
  lastModified: true,

  // Set max-age for Cache-Control header (ms)
  maxAge: '1d', // or 86400000

  // Redirect to trailing / for directories
  redirect: true,

  // Custom headers
  setHeaders: (res, path, stat) => {
    res.set('X-Timestamp', Date.now());
  }
}));
```

## Caching Strategies

### Development (No Cache)

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(express.static('public', {
    maxAge: 0,
    etag: false
  }));
}
```

### Production (Aggressive Caching)

```javascript
if (process.env.NODE_ENV === 'production') {
  // Versioned assets (can cache forever)
  app.use('/assets', express.static('public/assets', {
    maxAge: '1y',
    immutable: true
  }));

  // Regular static files
  app.use(express.static('public', {
    maxAge: '1d'
  }));
}
```

### Cache by File Type

```javascript
app.use(express.static('public', {
  setHeaders: (res, path) => {
    // Images and fonts - cache for 1 year
    if (path.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    // CSS and JS - cache for 1 week
    else if (path.match(/\.(css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
    // HTML - no cache
    else if (path.match(/\.html$/)) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));
```

## Serving Downloads

```javascript
const path = require('path');

// Serve file inline (display in browser)
app.get('/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'files', req.params.filename);
  res.sendFile(filePath);
});

// Force download
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'files', req.params.filename);
  res.download(filePath);
});

// Download with custom filename
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'files', req.params.filename);
  res.download(filePath, 'custom-name.pdf', (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});
```

## Handling File Uploads

```bash
npm install multer
```

```javascript
const multer = require('multer');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Single file upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded',
    file: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size
    }
  });
});

// Multiple files
app.post('/upload-multiple', upload.array('images', 5), (req, res) => {
  res.json({
    message: 'Files uploaded',
    files: req.files.map(f => ({
      filename: f.filename,
      path: `/uploads/${f.filename}`
    }))
  });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));
```

## Security Considerations

### Prevent Directory Traversal

```javascript
const path = require('path');

app.get('/files/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(__dirname, 'files', filename);

  // Ensure path is within allowed directory
  if (!filePath.startsWith(path.join(__dirname, 'files'))) {
    return res.status(403).send('Forbidden');
  }

  res.sendFile(filePath);
});
```

### Hide Sensitive Files

```javascript
app.use(express.static('public', {
  dotfiles: 'deny', // Block .env, .htaccess, etc.
  index: false      // Disable directory listing
}));
```

### Content Security Policy

```javascript
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com']
  }
}));
```

## Compression

```bash
npm install compression
```

```javascript
const compression = require('compression');

// Compress all responses
app.use(compression());

// Then serve static files
app.use(express.static('public'));
```

```javascript
// Selective compression
app.use(compression({
  filter: (req, res) => {
    // Don't compress already compressed files
    if (req.path.match(/\.(jpg|png|gif|zip|gz)$/)) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Compression level (0-9)
}));
```

## Using a CDN

```javascript
// In production, serve from CDN
const staticPath = process.env.NODE_ENV === 'production'
  ? 'https://cdn.example.com'
  : '/static';

app.locals.staticPath = staticPath;
```

```html
<!-- In templates -->
<link rel="stylesheet" href="<%= staticPath %>/css/style.css">
<script src="<%= staticPath %>/js/main.js"></script>
<img src="<%= staticPath %>/images/logo.png" alt="Logo">
```

## Complete Example

```javascript
const express = require('express');
const path = require('path');
const compression = require('compression');
const multer = require('multer');

const app = express();

// Compression
app.use(compression());

// Static files with caching
const staticOptions = {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
};

app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.filename}`
  });
});

// Download route
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'files', path.basename(req.params.filename));
  res.download(filePath);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Summary

In this tutorial, you learned:

- Setting up `express.static()` middleware
- Virtual path prefixes
- Caching strategies for different environments
- Serving downloads
- Handling file uploads with Multer
- Security best practices
- Response compression
- CDN integration

Next, we'll explore [Error Handling](/guide/express/07-error-handling) for building robust applications.
