# Code Editors

A code editor is your primary tool for writing code. Choosing the right editor and learning to use it effectively will significantly boost your productivity.

## Popular Code Editors

### Visual Studio Code (Recommended)

The most popular editor for web development.

**Pros:**
- Free and open-source
- Huge extension marketplace
- Built-in Git integration
- Integrated terminal
- Excellent for all web technologies
- Great debugging tools

**Download:** [code.visualstudio.com](https://code.visualstudio.com)

### Other Options

| Editor | Best For | Price |
|--------|----------|-------|
| **Sublime Text** | Speed, simplicity | Free trial, $99 license |
| **WebStorm** | Professional JS/TS | $69/year (free for students) |
| **Atom** | Hackability | Free (discontinued) |
| **Vim/Neovim** | Terminal, efficiency | Free |
| **Notepad++** | Windows, lightweight | Free |

## VS Code Setup Guide

### Essential Settings

Open settings with `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac).

```json
{
    // Editor
    "editor.fontSize": 14,
    "editor.tabSize": 2,
    "editor.wordWrap": "on",
    "editor.formatOnSave": true,
    "editor.minimap.enabled": false,

    // Files
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,

    // Terminal
    "terminal.integrated.fontSize": 13
}
```

### Recommended Extensions

#### Essential

| Extension | Purpose |
|-----------|---------|
| **Live Server** | Auto-reload browser on save |
| **Prettier** | Code formatting |
| **ESLint** | JavaScript linting |
| **Auto Rename Tag** | Rename paired HTML tags |
| **Path Intellisense** | Autocomplete file paths |

#### HTML/CSS

| Extension | Purpose |
|-----------|---------|
| **HTML CSS Support** | CSS class autocomplete |
| **CSS Peek** | Jump to CSS definitions |
| **Color Highlight** | Show colors in code |
| **HTML Snippets** | Quick HTML templates |

#### JavaScript/TypeScript

| Extension | Purpose |
|-----------|---------|
| **JavaScript (ES6) code snippets** | Quick code templates |
| **Import Cost** | Show package sizes |
| **Error Lens** | Inline error display |
| **Thunder Client** | API testing |

#### Git

| Extension | Purpose |
|-----------|---------|
| **GitLens** | Enhanced Git features |
| **Git Graph** | Visual commit history |

#### Productivity

| Extension | Purpose |
|-----------|---------|
| **Bracket Pair Colorizer** | Color matching brackets |
| **indent-rainbow** | Colorize indentation |
| **Better Comments** | Colored comment types |
| **Todo Tree** | Find TODO comments |

### Installing Extensions

1. Click Extensions icon in sidebar (`Ctrl+Shift+X`)
2. Search for extension name
3. Click "Install"

Or use command palette:
1. Press `Ctrl+Shift+P`
2. Type "Install Extensions"
3. Search and install

## VS Code Keyboard Shortcuts

### General

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+P` | Quick Open file |
| `Ctrl+,` | Settings |
| `Ctrl+`` ` | Toggle terminal |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+\` | Split editor |

### Editing

| Shortcut | Action |
|----------|--------|
| `Ctrl+X` | Cut line (no selection) |
| `Ctrl+C` | Copy line (no selection) |
| `Ctrl+Shift+K` | Delete line |
| `Alt+↑/↓` | Move line up/down |
| `Shift+Alt+↑/↓` | Copy line up/down |
| `Ctrl+D` | Select next occurrence |
| `Ctrl+Shift+L` | Select all occurrences |
| `Ctrl+/` | Toggle comment |
| `Shift+Alt+F` | Format document |

### Navigation

| Shortcut | Action |
|----------|--------|
| `Ctrl+G` | Go to line |
| `Ctrl+Shift+O` | Go to symbol |
| `F12` | Go to definition |
| `Alt+F12` | Peek definition |
| `Ctrl+Tab` | Switch between files |
| `Ctrl+Shift+E` | Explorer panel |
| `Ctrl+Shift+F` | Search in files |
| `Ctrl+Shift+G` | Source control |

### Multi-cursor

| Shortcut | Action |
|----------|--------|
| `Alt+Click` | Add cursor |
| `Ctrl+Alt+↑/↓` | Add cursor above/below |
| `Ctrl+Shift+L` | Cursor at all occurrences |

## Emmet Abbreviations

Emmet lets you write HTML and CSS faster using abbreviations.

### HTML Shortcuts

```html
<!-- Type and press Tab -->

! → Full HTML boilerplate

div → <div></div>

div.container → <div class="container"></div>

div#app → <div id="app"></div>

ul>li*3 →
<ul>
    <li></li>
    <li></li>
    <li></li>
</ul>

div>p+span →
<div>
    <p></p>
    <span></span>
</div>

a[href="https://example.com"] →
<a href="https://example.com"></a>

p{Hello World} → <p>Hello World</p>

ul>li.item$*3 →
<ul>
    <li class="item1"></li>
    <li class="item2"></li>
    <li class="item3"></li>
</ul>

.wrapper>.header+.main+.footer →
<div class="wrapper">
    <div class="header"></div>
    <div class="main"></div>
    <div class="footer"></div>
</div>
```

### CSS Shortcuts

```css
/* Type and press Tab */

m10 → margin: 10px;
p20 → padding: 20px;
w100 → width: 100px;
h50 → height: 50px;
fz16 → font-size: 16px;
fw700 → font-weight: 700;
bgc#333 → background-color: #333;
c#fff → color: #fff;
df → display: flex;
jcc → justify-content: center;
aic → align-items: center;
por → position: relative;
poa → position: absolute;
```

## Code Snippets

Create custom snippets in VS Code:

1. `Ctrl+Shift+P` → "Configure User Snippets"
2. Select language (e.g., "javascript.json")

```json
{
    "Console Log": {
        "prefix": "cl",
        "body": ["console.log($1);"],
        "description": "Console log"
    },
    "Arrow Function": {
        "prefix": "af",
        "body": [
            "const ${1:name} = (${2:params}) => {",
            "    $3",
            "};"
        ],
        "description": "Arrow function"
    },
    "React Component": {
        "prefix": "rfc",
        "body": [
            "function ${1:Component}() {",
            "    return (",
            "        <div>",
            "            $2",
            "        </div>",
            "    );",
            "}",
            "",
            "export default ${1:Component};"
        ],
        "description": "React functional component"
    }
}
```

## Workspace Setup

### Project-specific Settings

Create `.vscode/settings.json` in your project:

```json
{
    "editor.tabSize": 4,
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[html]": {
        "editor.defaultFormatter": "vscode.html-language-features"
    },
    "files.exclude": {
        "node_modules": true,
        ".git": true
    }
}
```

### Recommended Extensions for Project

Create `.vscode/extensions.json`:

```json
{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ritwickdey.liveserver"
    ]
}
```

## Integrated Terminal

### Opening Terminal

- Press `` Ctrl+` `` to toggle terminal
- Or: View → Terminal

### Terminal Tips

```bash
# Create new terminal
Ctrl+Shift+`

# Split terminal
Ctrl+Shift+5

# Navigate between terminals
Ctrl+PageUp / Ctrl+PageDown

# Clear terminal
Ctrl+L or type 'clear'
```

### Default Shell

Change default terminal shell in settings:

```json
{
    // Windows
    "terminal.integrated.defaultProfile.windows": "Git Bash",

    // Mac
    "terminal.integrated.defaultProfile.osx": "zsh"
}
```

## Debugging in VS Code

### Setup Launch Configuration

Create `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome",
            "url": "http://localhost:3000",
            "webRoot": "${workspaceFolder}"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Node.js",
            "program": "${workspaceFolder}/app.js"
        }
    ]
}
```

### Debugging Features

- Set breakpoints by clicking line numbers
- Use Debug panel (`Ctrl+Shift+D`)
- Step through code with F10/F11
- Inspect variables in Debug sidebar

## Productivity Tips

### 1. Learn Keyboard Shortcuts
Print a cheat sheet and learn 2-3 new shortcuts weekly.

### 2. Use Command Palette
`Ctrl+Shift+P` for any action you can't remember.

### 3. Quick Open Files
`Ctrl+P` then type filename - faster than clicking.

### 4. Multi-cursor Editing
Select similar text with `Ctrl+D` to edit all at once.

### 5. Use Zen Mode
`Ctrl+K Z` for distraction-free coding.

### 6. Sync Settings
Sign in with GitHub/Microsoft to sync settings across devices.

## Summary

- VS Code is the recommended editor for web development
- Install essential extensions for your workflow
- Learn keyboard shortcuts to boost productivity
- Use Emmet for faster HTML/CSS writing
- Configure project-specific settings
- Master the integrated terminal and debugger

## Next Steps

Learn about [Package Managers](/guide/environment/package-managers) to manage project dependencies.
