# DOM Manipulation

The Document Object Model (DOM) is a programming interface for web documents. It represents the page structure as a tree of objects that you can modify with JavaScript.

::: info What You'll Learn
- What the DOM is and how it works
- How to select elements with different methods
- How to modify content, attributes, and styles
- How to create, insert, and remove elements
- How to handle events and event delegation
:::

## What is the DOM?

The DOM is a tree-like representation of your HTML that JavaScript can interact with.

```
┌─────────────────────────────────────────────────────────────┐
│                        THE DOM TREE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HTML Document:              DOM Tree:                      │
│  ─────────────               ─────────                      │
│                                                             │
│  <!DOCTYPE html>                 document                   │
│  <html>                              │                      │
│    <head>                        ┌───┴───┐                  │
│      <title>                    html                        │
│    </head>                   ┌───┴───┐                      │
│    <body>                   head    body                    │
│      <div id="app">          │       │                      │
│        <h1>Hello</h1>      title    div#app                 │
│        <p>World</p>                ┌──┴──┐                  │
│      </div>                       h1     p                  │
│    </body>                        │      │                  │
│  </html>                       "Hello" "World"              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### HTML Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <div id="container">
        <h1>Hello World</h1>
        <p class="intro">Welcome to my page</p>
    </div>
</body>
</html>
```

## Selecting Elements

### Selection Methods Overview

| Method | Returns | Best For |
|--------|---------|----------|
| `getElementById()` | Single element | Selecting by unique ID |
| `getElementsByClassName()` | HTMLCollection (live) | Selecting by class |
| `getElementsByTagName()` | HTMLCollection (live) | Selecting by tag |
| `querySelector()` | Single element | CSS selector (first match) |
| `querySelectorAll()` | NodeList (static) | CSS selector (all matches) |

### getElementById()

Select a single element by its unique ID (fastest method).

```js
const container = document.getElementById("container");
console.log(container);

// Returns null if not found
const missing = document.getElementById("not-here");
console.log(missing); // null
```

### querySelector() and querySelectorAll()

Use CSS selectors to find elements - most flexible method.

```js
// querySelector - returns FIRST match
const heading = document.querySelector("h1");
const intro = document.querySelector(".intro");
const container = document.querySelector("#container");

// Complex selectors
const firstItem = document.querySelector("ul > li:first-child");
const link = document.querySelector('a[href="https://example.com"]');
const nested = document.querySelector(".card .title");

// querySelectorAll - returns ALL matches (NodeList)
const allParagraphs = document.querySelectorAll("p");
const allButtons = document.querySelectorAll("button.btn");

// Iterate over results
allParagraphs.forEach(p => {
    console.log(p.textContent);
});
```

### CSS Selector Reference

```
┌─────────────────────────────────────────────────────────────┐
│                  CSS SELECTORS FOR DOM                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BASIC SELECTORS:                                           │
│  ─────────────────                                          │
│  "div"              →  Tag name                             │
│  ".classname"       →  Class                                │
│  "#id"              →  ID                                   │
│  "*"                →  All elements                         │
│                                                             │
│  COMBINATORS:                                               │
│  ────────────                                               │
│  "div p"            →  p inside div (any depth)             │
│  "div > p"          →  p direct child of div                │
│  "div + p"          →  p immediately after div              │
│  "div ~ p"          →  p siblings after div                 │
│                                                             │
│  PSEUDO-SELECTORS:                                          │
│  ─────────────────                                          │
│  ":first-child"     →  First child element                  │
│  ":last-child"      →  Last child element                   │
│  ":nth-child(2)"    →  Second child                         │
│  ":not(.class)"     →  Elements without class               │
│                                                             │
│  ATTRIBUTE SELECTORS:                                       │
│  ────────────────────                                       │
│  "[href]"           →  Has href attribute                   │
│  "[type='text']"    →  type equals "text"                   │
│  "[class*='btn']"   →  class contains "btn"                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

::: tip querySelector vs getElementById
`querySelector` is more flexible but slightly slower. For simple ID lookups, `getElementById` is faster. For complex selections, use `querySelector`.
:::

## Modifying Content

### textContent vs innerHTML vs innerText

```js
const element = document.querySelector("#example");

// textContent - Get/set text (safest, fastest)
element.textContent = "Hello World";
console.log(element.textContent);

// innerHTML - Get/set HTML (can inject HTML)
element.innerHTML = "<strong>Bold</strong> text";

// innerText - Like textContent but respects CSS visibility
console.log(element.innerText);
```

### Comparison Table

| Property | Returns/Sets | Security | Performance |
|----------|--------------|----------|-------------|
| `textContent` | Raw text (including hidden) | Safe | Fast |
| `innerHTML` | HTML markup | **XSS risk!** | Slower |
| `innerText` | Visible text only | Safe | Slowest |

::: warning Security Warning
Never use `innerHTML` with user-provided content - it can lead to XSS attacks!

```js
// ❌ DANGEROUS - user could inject scripts
element.innerHTML = userInput;

// ✅ SAFE - treats content as plain text
element.textContent = userInput;
```
:::

## Modifying Attributes

```js
const link = document.querySelector("a");
const image = document.querySelector("img");

// getAttribute / setAttribute
const href = link.getAttribute("href");
link.setAttribute("href", "https://newsite.com");
link.setAttribute("target", "_blank");

// Direct property access (common attributes)
image.src = "new-image.jpg";
image.alt = "Description";
link.href = "https://example.com";

// Remove attribute
link.removeAttribute("target");

// Check if attribute exists
if (link.hasAttribute("target")) {
    console.log("Has target");
}
```

### data-* Attributes

Custom data attributes for storing data on elements.

```html
<div id="user" data-user-id="123" data-role="admin" data-active="true"></div>
```

```js
const user = document.querySelector("#user");

// Access via dataset (camelCase!)
console.log(user.dataset.userId);  // "123"
console.log(user.dataset.role);    // "admin"
console.log(user.dataset.active);  // "true"

// Modify
user.dataset.status = "online";

// Delete
delete user.dataset.active;
```

## Modifying Styles

### Inline Styles

```js
const box = document.querySelector(".box");

// Set individual styles (camelCase!)
box.style.backgroundColor = "blue";
box.style.width = "200px";
box.style.padding = "20px";
box.style.borderRadius = "10px";

// Set multiple styles at once
Object.assign(box.style, {
    backgroundColor: "blue",
    width: "200px",
    padding: "20px",
    fontSize: "16px"
});

// Read inline style
console.log(box.style.width); // "200px"
```

### CSS Classes (Recommended)

```js
const element = document.querySelector(".element");

// Add class
element.classList.add("active");

// Remove class
element.classList.remove("inactive");

// Toggle class (add if missing, remove if present)
element.classList.toggle("visible");

// Check if class exists
if (element.classList.contains("active")) {
    console.log("Element is active");
}

// Replace class
element.classList.replace("old-class", "new-class");

// Add multiple classes
element.classList.add("class1", "class2", "class3");

// Remove multiple classes
element.classList.remove("class1", "class2");
```

### classList Methods

```
┌─────────────────────────────────────────────────────────────┐
│                    classList METHODS                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  .add("class")       →  Add class                           │
│  .remove("class")    →  Remove class                        │
│  .toggle("class")    →  Add/remove class                    │
│  .contains("class")  →  Check if class exists (boolean)     │
│  .replace("a", "b")  →  Replace class "a" with "b"          │
│                                                             │
│  // Toggle with condition                                   │
│  .toggle("active", isActive)  → Add if true, remove if false│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Getting Computed Styles

```js
const element = document.querySelector(".box");
const styles = getComputedStyle(element);

// Get actual computed values (read-only)
console.log(styles.width);           // "200px"
console.log(styles.backgroundColor); // "rgb(0, 0, 255)"
console.log(styles.getPropertyValue("font-size")); // "16px"
```

## Creating Elements

### Step-by-Step Process

```js
// Step 1: Create the element
const newDiv = document.createElement("div");

// Step 2: Add content
newDiv.textContent = "Hello, I'm new!";

// Step 3: Add attributes/classes
newDiv.id = "new-div";
newDiv.className = "card featured";
// Or: newDiv.classList.add("card", "featured");

// Step 4: Add to the DOM
document.body.appendChild(newDiv);
```

### Visual: Creating and Adding Elements

```
┌─────────────────────────────────────────────────────────────┐
│              CREATING AND INSERTING ELEMENTS                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. createElement()     2. Configure         3. Insert      │
│     ↓                      ↓                    ↓           │
│  ┌─────────┐           ┌─────────┐          DOM Tree       │
│  │  <div>  │    →      │  <div>  │             │           │
│  │ (empty) │           │ id="x"  │          ┌──┴──┐        │
│  └─────────┘           │ class=  │        parent          │
│                        │ "card"  │          │             │
│                        │ Hello!  │       ┌──┴──┐          │
│                        └─────────┘     child  NEW!        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Insertion Methods

```js
const container = document.querySelector("#container");
const newElement = document.createElement("p");
newElement.textContent = "New paragraph";

// appendChild - add as last child
container.appendChild(newElement);

// insertBefore - add before a reference element
const reference = container.querySelector(".reference");
container.insertBefore(newElement, reference);

// Modern methods (more flexible):
container.append(newElement);      // Add at end (can add multiple, strings)
container.prepend(newElement);     // Add at beginning
container.before(newElement);      // Add before container
container.after(newElement);       // Add after container

// insertAdjacentElement - precise positioning
reference.insertAdjacentElement("beforebegin", newElement); // Before element
reference.insertAdjacentElement("afterbegin", newElement);  // First child
reference.insertAdjacentElement("beforeend", newElement);   // Last child
reference.insertAdjacentElement("afterend", newElement);    // After element

// insertAdjacentHTML - insert HTML string
container.insertAdjacentHTML("beforeend", "<p>HTML content</p>");
```

### Insertion Position Reference

```
         beforebegin
              │
              ▼
        ┌───────────┐
        │  element  │ ← afterbegin (first child position)
        │           │
        │  content  │
        │           │
        │           │ ← beforeend (last child position)
        └───────────┘
              │
              ▼
          afterend
```

## Removing Elements

```js
const element = document.querySelector(".to-remove");

// Modern method (preferred)
element.remove();

// Legacy method (using parent)
element.parentNode.removeChild(element);

// Remove all children
const container = document.querySelector("#container");
container.innerHTML = "";  // Quick but destroys event listeners

// Safer way to remove all children
while (container.firstChild) {
    container.removeChild(container.firstChild);
}

// Or using replaceChildren (modern)
container.replaceChildren(); // Remove all
container.replaceChildren(newChild1, newChild2); // Replace with new
```

## Event Handling

### Adding Event Listeners

```js
const button = document.querySelector("#myButton");

// Method 1: addEventListener (recommended)
button.addEventListener("click", function(event) {
    console.log("Button clicked!");
    console.log("Event:", event);
});

// Method 2: Arrow function
button.addEventListener("click", (event) => {
    console.log("Clicked with arrow function");
});

// Method 3: Named function (can be removed later)
function handleClick(event) {
    console.log("Handled by named function");
}
button.addEventListener("click", handleClick);

// Remove event listener (must use same function reference)
button.removeEventListener("click", handleClick);
```

### Common Events Reference

```
┌─────────────────────────────────────────────────────────────┐
│                     COMMON DOM EVENTS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MOUSE EVENTS:                                              │
│  click      - Single click                                  │
│  dblclick   - Double click                                  │
│  mouseenter - Mouse enters element (no bubbling)            │
│  mouseleave - Mouse leaves element (no bubbling)            │
│  mouseover  - Mouse over element (bubbles)                  │
│  mouseout   - Mouse leaves element (bubbles)                │
│  mousemove  - Mouse moves over element                      │
│                                                             │
│  KEYBOARD EVENTS:                                           │
│  keydown    - Key pressed down                              │
│  keyup      - Key released                                  │
│  keypress   - Character key pressed (deprecated)            │
│                                                             │
│  FORM EVENTS:                                               │
│  input      - Input value changed (fires immediately)       │
│  change     - Value changed (fires on blur)                 │
│  submit     - Form submitted                                │
│  focus      - Element focused                               │
│  blur       - Element lost focus                            │
│                                                             │
│  WINDOW EVENTS:                                             │
│  load       - Page fully loaded                             │
│  DOMContentLoaded - HTML parsed (before images)             │
│  resize     - Window resized                                │
│  scroll     - Page scrolled                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### The Event Object

```js
button.addEventListener("click", (event) => {
    // Event information
    console.log(event.type);          // "click"
    console.log(event.target);        // Element that triggered event
    console.log(event.currentTarget); // Element listener is attached to

    // Mouse position
    console.log(event.clientX);       // X relative to viewport
    console.log(event.clientY);       // Y relative to viewport
    console.log(event.pageX);         // X relative to document
    console.log(event.pageY);         // Y relative to document

    // Prevent default behavior
    event.preventDefault();

    // Stop event from bubbling up
    event.stopPropagation();
});

// Keyboard events
document.addEventListener("keydown", (event) => {
    console.log(event.key);       // "Enter", "a", "Escape", etc.
    console.log(event.code);      // "Enter", "KeyA", "Escape", etc.
    console.log(event.ctrlKey);   // true if Ctrl pressed
    console.log(event.shiftKey);  // true if Shift pressed
    console.log(event.altKey);    // true if Alt pressed
    console.log(event.metaKey);   // true if Cmd/Win pressed
});
```

### Event Delegation

Handle events on dynamically created elements by listening on a parent.

```js
// ❌ Problem: Adding listeners to each item doesn't work for new items
document.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", handleClick);
});
// New items won't have the listener!

// ✅ Solution: Event delegation - listen on parent
const list = document.querySelector("#item-list");

list.addEventListener("click", (event) => {
    // Check if clicked element is a list item
    if (event.target.matches("li")) {
        console.log("Clicked:", event.target.textContent);
    }

    // Or find closest matching ancestor
    const item = event.target.closest("li");
    if (item) {
        console.log("Clicked item:", item.textContent);
    }
});
```

### Event Delegation Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    EVENT DELEGATION                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Instead of:                     Use:                       │
│  ────────────                    ────                       │
│                                                             │
│  ┌─────────────────┐            ┌─────────────────┐        │
│  │ ul              │            │ ul 👂 LISTENER  │        │
│  │ ┌─────────────┐ │            │ ┌─────────────┐ │        │
│  │ │ li 👂       │ │            │ │ li          │ │        │
│  │ └─────────────┘ │            │ └─────────────┘ │        │
│  │ ┌─────────────┐ │            │ ┌─────────────┐ │        │
│  │ │ li 👂       │ │    →       │ │ li          │ │        │
│  │ └─────────────┘ │            │ └─────────────┘ │        │
│  │ ┌─────────────┐ │            │ ┌─────────────┐ │        │
│  │ │ li 👂       │ │            │ │ li (new!)   │ │        │
│  │ └─────────────┘ │            │ └─────────────┘ │        │
│  └─────────────────┘            └─────────────────┘        │
│                                                             │
│  3 listeners                     1 listener                 │
│  New items: NO handler          New items: Works!           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## DOM Traversal

Navigate between elements in the DOM tree.

```js
const element = document.querySelector(".current");

// PARENT
element.parentNode;        // Parent node (any type)
element.parentElement;     // Parent element

// CHILDREN
element.childNodes;        // All child nodes (includes text)
element.children;          // Only element children
element.firstChild;        // First child node
element.firstElementChild; // First element child
element.lastChild;         // Last child node
element.lastElementChild;  // Last element child

// SIBLINGS
element.nextSibling;           // Next node
element.nextElementSibling;    // Next element
element.previousSibling;       // Previous node
element.previousElementSibling; // Previous element

// CLOSEST ANCESTOR
const form = element.closest("form");       // Find ancestor form
const container = element.closest(".container"); // Find ancestor with class
```

### Traversal Visual

```
                    parentElement
                         │
        ┌────────────────┼────────────────┐
        │                │                │
  previousElement    ELEMENT      nextElementSibling
     Sibling             │
                   ┌─────┼─────┐
                   │     │     │
               first  children  last
             Element          Element
              Child            Child
```

## Practical Examples

### Toggle Menu

```js
const menuButton = document.querySelector("#menu-toggle");
const menu = document.querySelector("#menu");

menuButton.addEventListener("click", () => {
    // Toggle visibility class
    menu.classList.toggle("open");

    // Update accessibility attribute
    const isOpen = menu.classList.contains("open");
    menuButton.setAttribute("aria-expanded", isOpen);

    // Update button text
    menuButton.textContent = isOpen ? "Close" : "Menu";
});
```

### Form Handling

```js
const form = document.querySelector("#signup-form");

form.addEventListener("submit", (event) => {
    // Prevent page reload
    event.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);

    // Or access fields directly
    const email = form.querySelector("#email").value;
    const password = form.querySelector("#password").value;

    // Validate
    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    // Submit data
    console.log("Submitting:", { email, password });
});
```

### Dynamic Todo List

```js
const list = document.querySelector("#todo-list");
const input = document.querySelector("#new-todo");
const addButton = document.querySelector("#add-todo");

// Add new todo
addButton.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;

    const li = document.createElement("li");
    li.innerHTML = `
        <span class="todo-text">${text}</span>
        <button class="delete-btn">Delete</button>
    `;

    list.appendChild(li);
    input.value = "";
    input.focus();
});

// Handle Enter key
input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addButton.click();
    }
});

// Event delegation for delete buttons
list.addEventListener("click", (event) => {
    if (event.target.matches(".delete-btn")) {
        event.target.closest("li").remove();
    }
});
```

## Exercises

### Exercise 1: Tab Component

Create a tab switching component.

::: details Solution
```html
<div class="tabs">
    <button class="tab-btn active" data-tab="tab1">Tab 1</button>
    <button class="tab-btn" data-tab="tab2">Tab 2</button>
    <button class="tab-btn" data-tab="tab3">Tab 3</button>
</div>
<div class="tab-content">
    <div id="tab1" class="tab-pane active">Content 1</div>
    <div id="tab2" class="tab-pane">Content 2</div>
    <div id="tab3" class="tab-pane">Content 3</div>
</div>
```

```js
const tabContainer = document.querySelector(".tabs");

tabContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;

    // Update buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    button.classList.add("active");

    // Update content
    document.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.remove("active");
    });
    document.getElementById(button.dataset.tab).classList.add("active");
});
```

```css
.tab-pane { display: none; }
.tab-pane.active { display: block; }
.tab-btn.active { background: #007bff; color: white; }
```
:::

### Exercise 2: Modal Dialog

Create a modal that opens and closes.

::: details Solution
```js
function createModal(content) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
        <div class="modal">
            <button class="modal-close">&times;</button>
            <div class="modal-content">${content}</div>
        </div>
    `;

    // Close handlers
    const close = () => {
        overlay.remove();
        document.removeEventListener("keydown", handleEscape);
    };

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    // Close on button click
    overlay.querySelector(".modal-close").addEventListener("click", close);

    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleEscape);

    // Add to page
    document.body.appendChild(overlay);

    // Return close function for external use
    return close;
}

// Usage
document.querySelector("#open-modal").addEventListener("click", () => {
    createModal("<h2>Hello!</h2><p>This is a modal dialog.</p>");
});
```

```css
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    position: relative;
    max-width: 500px;
}
.modal-close {
    position: absolute;
    top: 10px; right: 10px;
    border: none;
    background: none;
    font-size: 24px;
    cursor: pointer;
}
```
:::

## Summary

| Concept | Method/Property | Description |
|---------|-----------------|-------------|
| **Select by ID** | `getElementById()` | Fastest, returns single element |
| **Select by CSS** | `querySelector()` | First match, flexible |
| **Select all** | `querySelectorAll()` | All matches (NodeList) |
| **Text content** | `textContent` | Get/set text safely |
| **HTML content** | `innerHTML` | Get/set HTML (XSS risk!) |
| **Classes** | `classList.add/remove/toggle` | Manage CSS classes |
| **Styles** | `element.style.prop` | Inline styles |
| **Attributes** | `get/setAttribute()` | Custom attributes |
| **Create** | `createElement()` | Make new element |
| **Insert** | `append/prepend/before/after` | Add to DOM |
| **Remove** | `remove()` | Delete from DOM |
| **Events** | `addEventListener()` | Handle user actions |
| **Delegation** | Listen on parent | Handle dynamic elements |

## Next Steps

Continue to [Async Programming](/guide/javascript/07-async) to learn about handling asynchronous operations.
