# Getting Started

This guide will help you set up your development environment and write your first web page.

## What You'll Need

### 1. A Code Editor

A code editor is where you'll write your code. We recommend **Visual Studio Code** (VS Code):

- Free and open-source
- Great extensions for web development
- Built-in terminal and Git support
- Available on Windows, Mac, and Linux

**Download:** [code.visualstudio.com](https://code.visualstudio.com)

#### Recommended VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| Live Server | Auto-reload pages during development |
| Prettier | Code formatting |
| ESLint | JavaScript linting |
| Auto Rename Tag | Rename paired HTML tags |
| HTML CSS Support | CSS class autocomplete in HTML |

### 2. A Web Browser

Modern browsers have excellent developer tools:

- **Google Chrome** - Most popular, great DevTools
- **Firefox** - Excellent for CSS debugging
- **Microsoft Edge** - Chromium-based, Windows integrated
- **Safari** - Required for testing on Mac/iOS

### 3. Basic Computer Skills

- Creating and managing files/folders
- Using a web browser
- Typing and editing text

## Setting Up Your Workspace

### Create a Project Folder

Create a dedicated folder for your web development projects:

```
📁 Projects/
  └── 📁 my-first-website/
       ├── 📄 index.html
       ├── 📄 styles.css
       └── 📄 script.js
```

### Open in VS Code

1. Open VS Code
2. Go to **File → Open Folder**
3. Select your project folder

## Your First Web Page

Let's create a simple web page step by step.

### Step 1: Create index.html

Create a new file called `index.html` and add this code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
        <nav>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>

    <main>
        <section id="about">
            <h2>About Me</h2>
            <p>Hello! I'm learning web development.</p>
        </section>

        <section id="contact">
            <h2>Contact</h2>
            <p>You can reach me at: example@email.com</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 My First Website</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
```

### Step 2: Create styles.css

Create a new file called `styles.css`:

```css
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

/* Header styles */
header {
    background: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header h1 {
    font-size: 1.5rem;
}

nav a {
    color: white;
    text-decoration: none;
    margin-left: 1rem;
}

nav a:hover {
    text-decoration: underline;
}

/* Main content */
main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

section {
    margin-bottom: 2rem;
}

h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

/* Footer */
footer {
    background: #ecf0f1;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
}
```

### Step 3: Create script.js

Create a new file called `script.js`:

```javascript
// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded successfully!');

    // Add a simple interaction
    const header = document.querySelector('header h1');

    header.addEventListener('click', () => {
        alert('Welcome to web development!');
    });
});
```

### Step 4: View Your Page

**Option A: Using Live Server (Recommended)**
1. Right-click on `index.html` in VS Code
2. Select "Open with Live Server"
3. Your page opens in the browser with auto-reload

**Option B: Direct Browser**
1. Locate your `index.html` file
2. Double-click to open in your default browser
3. Or drag the file into an open browser window

## Using Browser Developer Tools

Every modern browser has built-in developer tools. Access them by:
- **Windows/Linux:** Press `F12` or `Ctrl + Shift + I`
- **Mac:** Press `Cmd + Option + I`

### Key DevTools Panels

| Panel | Purpose |
|-------|---------|
| Elements | Inspect and edit HTML/CSS |
| Console | View JavaScript output and errors |
| Network | Monitor file loading and API calls |
| Sources | Debug JavaScript code |

### Try It: Console

1. Open DevTools (`F12`)
2. Go to the Console tab
3. Type: `console.log('Hello from the console!')`
4. Press Enter

You should see your message appear!

## Learning Tips

### Practice Regularly
- Code every day, even if just for 15 minutes
- Build small projects to reinforce learning
- Don't just read—type out the code yourself

### Break Things (Intentionally)
- Experiment with changing values
- See what happens when you remove code
- Learning from errors is valuable

### Use Resources
- **MDN Web Docs** - Comprehensive documentation
- **W3Schools** - Beginner-friendly tutorials
- **Stack Overflow** - Community Q&A

### Start Small
- Begin with simple pages
- Add features one at a time
- Don't try to learn everything at once

## Common Beginner Mistakes

| Mistake | Solution |
|---------|----------|
| Forgetting to save files | Enable auto-save in VS Code |
| Missing closing tags | Use editor extensions to help |
| Typos in file names | Check spelling, case matters |
| Not refreshing the browser | Use Live Server for auto-reload |
| Copying code without understanding | Type it out and experiment |

## Project Ideas to Practice

### Beginner Projects
1. Personal bio page
2. Recipe card
3. Photo gallery
4. Favorite quotes page

### After Learning More
5. Calculator
6. To-do list
7. Weather display
8. Simple game

## Summary

- VS Code is the recommended code editor
- Start with HTML, CSS, and JavaScript files
- Use Live Server for development
- Browser DevTools are essential for debugging
- Practice regularly and build projects

## What's Next?

You're now ready to start learning! Begin with:

- [HTML Tutorial](/guide/html/) - Learn to structure web pages
- [CSS Tutorial](/guide/css/) - Style your websites
- [JavaScript Tutorial](/guide/javascript/) - Add interactivity

::: tip
Bookmark this tutorials site and work through each section systematically. Happy coding!
:::
