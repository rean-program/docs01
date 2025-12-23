# How the Web Works

Understanding how the web works is essential for any web developer. This page explains the fundamental concepts and technologies that power the internet.

## The Internet vs The Web

### The Internet
The internet is a global network of interconnected computers that communicate using standardized protocols. It's the infrastructure that enables data transfer.

### The World Wide Web
The web is a service that runs on the internet. It consists of websites and web applications accessible through browsers using HTTP/HTTPS protocols.

::: info
Think of the internet as the road system, and the web as the cars and trucks that travel on it.
:::

## How a Website Loads

When you visit a website, here's what happens:

```
1. You type a URL
        ↓
2. DNS lookup finds the server IP
        ↓
3. Browser connects to the server
        ↓
4. Server sends back files
        ↓
5. Browser renders the page     
```

### Step-by-Step Process

#### 1. Entering the URL
You type `https://example.com` into your browser's address bar.

#### 2. DNS Resolution
The Domain Name System (DNS) translates the domain name into an IP address.

```
example.com → 93.184.216.34
```

#### 3. TCP/IP Connection
Your browser establishes a connection with the server using TCP/IP protocols.

#### 4. HTTP Request
The browser sends an HTTP request to the server:

```http
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Chrome/120.0
Accept: text/html
```

#### 5. Server Response
The server processes the request and sends back a response:

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!DOCTYPE html>
<html>
  <head>...</head>
  <body>...</body>
</html>
```

#### 6. Browser Rendering
The browser parses HTML, CSS, and JavaScript to display the page.

## Key Technologies

### HTTP/HTTPS

HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web.

| Method | Purpose |
|--------|---------|
| GET | Retrieve data |
| POST | Send data |
| PUT | Update data |
| DELETE | Remove data |

HTTPS adds encryption for security using SSL/TLS certificates.

### DNS (Domain Name System)

DNS is like the internet's phone book, translating domain names to IP addresses.

```
Browser → DNS Server → IP Address
   ↑                        ↓
   └────── Connection ──────┘
```

### IP Addresses

Every device on the internet has a unique IP address:
- **IPv4**: `192.168.1.1` (32-bit)
- **IPv6**: `2001:0db8:85a3:0000:0000:8a2e:0370:7334` (128-bit)

### TCP/IP

TCP/IP is the communication protocol that enables data transfer:
- **TCP**: Ensures reliable delivery of data packets
- **IP**: Handles addressing and routing

## Client-Server Architecture

### The Client
- Usually a web browser
- Sends requests
- Receives and displays responses
- Runs client-side code (JavaScript)

### The Server
- A computer running web server software
- Receives and processes requests
- Sends back responses
- Runs server-side code (Node.js, Python, PHP, etc.)

```
┌─────────┐         Request          ┌─────────┐
│         │ ──────────────────────→  │         │
│ Client  │                          │ Server  │
│(Browser)│ ←──────────────────────  │         │
└─────────┘         Response         └─────────┘
```

## Web Standards

Web technologies are standardized by organizations:

- **W3C** (World Wide Web Consortium) - HTML, CSS standards
- **ECMA International** - JavaScript (ECMAScript) standards
- **WHATWG** - HTML Living Standard
- **IETF** - Internet protocols (HTTP, DNS)

## Browser Rendering Process

When a browser receives HTML, it goes through these steps:

### 1. Parse HTML
Converts HTML into the DOM (Document Object Model)

### 2. Parse CSS
Converts CSS into the CSSOM (CSS Object Model)

### 3. Build Render Tree
Combines DOM and CSSOM

### 4. Layout
Calculates the position and size of elements

### 5. Paint
Draws pixels on the screen

```
HTML → DOM  ─┐
             ├→ Render Tree → Layout → Paint
CSS → CSSOM ─┘
```

## Summary

- The internet is the network; the web runs on top of it
- DNS translates domain names to IP addresses
- HTTP/HTTPS enables communication between clients and servers
- Browsers parse HTML, CSS, and JavaScript to render pages
- Web standards ensure consistent behavior across browsers

## Next Steps

Learn about the [different types of web development](/guide/fundamentals/web-development-overview) and find your path in the industry.
