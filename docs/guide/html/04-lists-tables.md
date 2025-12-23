# Lists and Tables

Learn how to organize content using lists and display data using tables in HTML.

## Lists

HTML provides three types of lists for organizing content.

### Unordered Lists

Bulleted lists for items without a specific order:

```html
<ul>
    <li>Apple</li>
    <li>Banana</li>
    <li>Orange</li>
</ul>
```

**Output:**
- Apple
- Banana
- Orange

### Ordered Lists

Numbered lists for sequential items:

```html
<ol>
    <li>First step</li>
    <li>Second step</li>
    <li>Third step</li>
</ol>
```

**Output:**
1. First step
2. Second step
3. Third step

### Ordered List Attributes

```html
<!-- Start from different number -->
<ol start="5">
    <li>Item five</li>
    <li>Item six</li>
</ol>

<!-- Reverse order -->
<ol reversed>
    <li>Third</li>
    <li>Second</li>
    <li>First</li>
</ol>

<!-- Different numbering types -->
<ol type="A">  <!-- A, B, C -->
    <li>Item</li>
</ol>

<ol type="a">  <!-- a, b, c -->
    <li>Item</li>
</ol>

<ol type="I">  <!-- I, II, III (Roman) -->
    <li>Item</li>
</ol>

<ol type="i">  <!-- i, ii, iii -->
    <li>Item</li>
</ol>
```

### Description Lists

For terms and definitions:

```html
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language - the standard language for web pages.</dd>

    <dt>CSS</dt>
    <dd>Cascading Style Sheets - used for styling web pages.</dd>

    <dt>JavaScript</dt>
    <dd>A programming language for web interactivity.</dd>
</dl>
```

| Element | Purpose |
|---------|---------|
| `<dl>` | Description list container |
| `<dt>` | Description term |
| `<dd>` | Description details |

### Nested Lists

Lists inside lists:

```html
<ul>
    <li>Fruits
        <ul>
            <li>Apple</li>
            <li>Banana</li>
            <li>Orange</li>
        </ul>
    </li>
    <li>Vegetables
        <ul>
            <li>Carrot</li>
            <li>Broccoli</li>
            <li>Spinach</li>
        </ul>
    </li>
</ul>
```

Mixed nested lists:

```html
<ol>
    <li>Prepare ingredients
        <ul>
            <li>2 cups flour</li>
            <li>1 cup sugar</li>
            <li>3 eggs</li>
        </ul>
    </li>
    <li>Mix dry ingredients</li>
    <li>Add wet ingredients</li>
    <li>Bake at 350°F</li>
</ol>
```

## Tables

Tables organize data into rows and columns.

### Basic Table Structure

```html
<table>
    <tr>
        <th>Name</th>
        <th>Age</th>
        <th>City</th>
    </tr>
    <tr>
        <td>John</td>
        <td>25</td>
        <td>New York</td>
    </tr>
    <tr>
        <td>Jane</td>
        <td>30</td>
        <td>Los Angeles</td>
    </tr>
</table>
```

| Element | Purpose |
|---------|---------|
| `<table>` | Table container |
| `<tr>` | Table row |
| `<th>` | Table header cell |
| `<td>` | Table data cell |

### Table Sections

Organize tables with header, body, and footer:

```html
<table>
    <thead>
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Apple</td>
            <td>$1.00</td>
            <td>10</td>
        </tr>
        <tr>
            <td>Banana</td>
            <td>$0.50</td>
            <td>15</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td>Total</td>
            <td>$17.50</td>
            <td>25</td>
        </tr>
    </tfoot>
</table>
```

### Table Caption

Add a title to your table:

```html
<table>
    <caption>Monthly Sales Report</caption>
    <thead>
        <tr>
            <th>Month</th>
            <th>Sales</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>January</td>
            <td>$10,000</td>
        </tr>
    </tbody>
</table>
```

### Spanning Rows and Columns

#### Column Span

```html
<table>
    <tr>
        <th colspan="3">Contact Information</th>
    </tr>
    <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
    </tr>
    <tr>
        <td>John</td>
        <td>john@example.com</td>
        <td>555-1234</td>
    </tr>
</table>
```

#### Row Span

```html
<table>
    <tr>
        <th>Name</th>
        <td>John Doe</td>
    </tr>
    <tr>
        <th rowspan="2">Contact</th>
        <td>john@example.com</td>
    </tr>
    <tr>
        <td>555-1234</td>
    </tr>
</table>
```

#### Combined Spanning

```html
<table>
    <tr>
        <th colspan="2" rowspan="2"></th>
        <th colspan="2">Semester 1</th>
        <th colspan="2">Semester 2</th>
    </tr>
    <tr>
        <th>Math</th>
        <th>Science</th>
        <th>Math</th>
        <th>Science</th>
    </tr>
    <tr>
        <th rowspan="2">Grade 9</th>
        <th>Class A</th>
        <td>85</td>
        <td>90</td>
        <td>88</td>
        <td>92</td>
    </tr>
    <tr>
        <th>Class B</th>
        <td>78</td>
        <td>85</td>
        <td>82</td>
        <td>88</td>
    </tr>
</table>
```

### Column Groups

Style groups of columns:

```html
<table>
    <colgroup>
        <col style="background-color: #f0f0f0;">
        <col span="2" style="background-color: #e0e0e0;">
    </colgroup>
    <tr>
        <th>Name</th>
        <th>Q1</th>
        <th>Q2</th>
    </tr>
    <tr>
        <td>John</td>
        <td>$1000</td>
        <td>$1200</td>
    </tr>
</table>
```

### Table Accessibility

#### Scope Attribute

```html
<table>
    <tr>
        <th scope="col">Name</th>
        <th scope="col">Age</th>
        <th scope="col">City</th>
    </tr>
    <tr>
        <th scope="row">John</th>
        <td>25</td>
        <td>NYC</td>
    </tr>
    <tr>
        <th scope="row">Jane</th>
        <td>30</td>
        <td>LA</td>
    </tr>
</table>
```

#### Headers Attribute

For complex tables:

```html
<table>
    <tr>
        <th id="name">Name</th>
        <th id="q1">Q1</th>
        <th id="q2">Q2</th>
    </tr>
    <tr>
        <td headers="name">John</td>
        <td headers="q1">$1000</td>
        <td headers="q2">$1200</td>
    </tr>
</table>
```

## Practical Examples

### Navigation Menu

```html
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a>
            <ul>
                <li><a href="/about/team">Team</a></li>
                <li><a href="/about/history">History</a></li>
            </ul>
        </li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

### FAQ Section

```html
<dl class="faq">
    <dt>How do I create an account?</dt>
    <dd>Click the "Sign Up" button and fill out the registration form.</dd>

    <dt>What payment methods do you accept?</dt>
    <dd>We accept credit cards, PayPal, and bank transfers.</dd>

    <dt>How can I contact support?</dt>
    <dd>Email us at support@example.com or call 1-800-EXAMPLE.</dd>
</dl>
```

### Pricing Table

```html
<table class="pricing">
    <caption>Pricing Plans</caption>
    <thead>
        <tr>
            <th scope="col">Feature</th>
            <th scope="col">Basic</th>
            <th scope="col">Pro</th>
            <th scope="col">Enterprise</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Storage</th>
            <td>5 GB</td>
            <td>50 GB</td>
            <td>Unlimited</td>
        </tr>
        <tr>
            <th scope="row">Users</th>
            <td>1</td>
            <td>5</td>
            <td>Unlimited</td>
        </tr>
        <tr>
            <th scope="row">Support</th>
            <td>Email</td>
            <td>Priority</td>
            <td>24/7 Phone</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">Price</th>
            <td>$9/mo</td>
            <td>$29/mo</td>
            <td>$99/mo</td>
        </tr>
    </tfoot>
</table>
```

### Schedule Table

```html
<table class="schedule">
    <caption>Weekly Class Schedule</caption>
    <thead>
        <tr>
            <th scope="col">Time</th>
            <th scope="col">Monday</th>
            <th scope="col">Tuesday</th>
            <th scope="col">Wednesday</th>
            <th scope="col">Thursday</th>
            <th scope="col">Friday</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">9:00 AM</th>
            <td>Math</td>
            <td>English</td>
            <td>Math</td>
            <td>Science</td>
            <td>Art</td>
        </tr>
        <tr>
            <th scope="row">10:00 AM</th>
            <td>Science</td>
            <td>Math</td>
            <td>English</td>
            <td>Math</td>
            <td>PE</td>
        </tr>
        <tr>
            <th scope="row">11:00 AM</th>
            <td colspan="5" style="text-align: center;">Lunch Break</td>
        </tr>
        <tr>
            <th scope="row">12:00 PM</th>
            <td>History</td>
            <td>Science</td>
            <td>History</td>
            <td>English</td>
            <td>Music</td>
        </tr>
    </tbody>
</table>
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lists and Tables Example</title>
</head>
<body>
    <h1>Company Information</h1>

    <section>
        <h2>Our Services</h2>
        <ul>
            <li>Web Development
                <ul>
                    <li>Frontend Development</li>
                    <li>Backend Development</li>
                    <li>Full Stack Solutions</li>
                </ul>
            </li>
            <li>Mobile Apps</li>
            <li>Cloud Services</li>
        </ul>
    </section>

    <section>
        <h2>Getting Started</h2>
        <ol>
            <li>Contact us for a consultation</li>
            <li>Discuss your requirements</li>
            <li>Receive a custom proposal</li>
            <li>Begin development</li>
            <li>Launch your project</li>
        </ol>
    </section>

    <section>
        <h2>Technologies We Use</h2>
        <dl>
            <dt>React</dt>
            <dd>A JavaScript library for building user interfaces.</dd>

            <dt>Node.js</dt>
            <dd>JavaScript runtime for server-side development.</dd>

            <dt>PostgreSQL</dt>
            <dd>Powerful open-source relational database.</dd>
        </dl>
    </section>

    <section>
        <h2>Team Members</h2>
        <table>
            <caption>Our Development Team</caption>
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Role</th>
                    <th scope="col">Experience</th>
                    <th scope="col">Email</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>John Smith</td>
                    <td>Lead Developer</td>
                    <td>10 years</td>
                    <td>john@company.com</td>
                </tr>
                <tr>
                    <td>Jane Doe</td>
                    <td>Frontend Developer</td>
                    <td>5 years</td>
                    <td>jane@company.com</td>
                </tr>
                <tr>
                    <td>Bob Johnson</td>
                    <td>Backend Developer</td>
                    <td>7 years</td>
                    <td>bob@company.com</td>
                </tr>
            </tbody>
        </table>
    </section>
</body>
</html>
```

## Exercises

### Exercise 1: Recipe Instructions
Create a recipe with an unordered list for ingredients and an ordered list for steps.

::: details Solution
```html
<h2>Chocolate Chip Cookies</h2>

<h3>Ingredients</h3>
<ul>
    <li>2 cups all-purpose flour</li>
    <li>1 cup butter, softened</li>
    <li>3/4 cup sugar</li>
    <li>2 eggs</li>
    <li>1 tsp vanilla extract</li>
    <li>2 cups chocolate chips</li>
</ul>

<h3>Instructions</h3>
<ol>
    <li>Preheat oven to 375°F (190°C)</li>
    <li>Cream butter and sugar until fluffy</li>
    <li>Beat in eggs and vanilla</li>
    <li>Gradually add flour and mix</li>
    <li>Fold in chocolate chips</li>
    <li>Drop spoonfuls onto baking sheet</li>
    <li>Bake for 9-11 minutes until golden</li>
    <li>Cool on wire rack</li>
</ol>
```
:::

### Exercise 2: Product Comparison Table
Create a comparison table for three products.

::: details Solution
```html
<table>
    <caption>Smartphone Comparison</caption>
    <thead>
        <tr>
            <th scope="col">Feature</th>
            <th scope="col">Phone A</th>
            <th scope="col">Phone B</th>
            <th scope="col">Phone C</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Screen Size</th>
            <td>6.1"</td>
            <td>6.7"</td>
            <td>6.4"</td>
        </tr>
        <tr>
            <th scope="row">Storage</th>
            <td>128 GB</td>
            <td>256 GB</td>
            <td>128 GB</td>
        </tr>
        <tr>
            <th scope="row">Camera</th>
            <td>12 MP</td>
            <td>48 MP</td>
            <td>64 MP</td>
        </tr>
        <tr>
            <th scope="row">Battery</th>
            <td>3200 mAh</td>
            <td>4500 mAh</td>
            <td>5000 mAh</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">Price</th>
            <td>$699</td>
            <td>$999</td>
            <td>$599</td>
        </tr>
    </tfoot>
</table>
```
:::

### Exercise 3: Glossary
Create a glossary using a description list.

::: details Solution
```html
<h2>Web Development Glossary</h2>
<dl>
    <dt>API</dt>
    <dd>Application Programming Interface - a set of protocols for building software applications.</dd>

    <dt>CSS</dt>
    <dd>Cascading Style Sheets - a style sheet language for describing the presentation of HTML documents.</dd>

    <dt>DOM</dt>
    <dd>Document Object Model - a programming interface for HTML documents.</dd>

    <dt>HTTP</dt>
    <dd>HyperText Transfer Protocol - the foundation of data communication on the web.</dd>

    <dt>REST</dt>
    <dd>Representational State Transfer - an architectural style for designing networked applications.</dd>
</dl>
```
:::

## Summary

- **Unordered lists** (`<ul>`) for bulleted items
- **Ordered lists** (`<ol>`) for numbered/sequential items
- **Description lists** (`<dl>`) for terms and definitions
- Lists can be nested for hierarchical content
- Tables organize data in rows and columns
- Use `<thead>`, `<tbody>`, `<tfoot>` for table structure
- `colspan` and `rowspan` merge cells
- Use `scope` attribute for accessibility
- Always include `<caption>` for table descriptions

## Next Steps

Continue to [Forms](/guide/html/05-forms) to learn how to create interactive user input forms.
