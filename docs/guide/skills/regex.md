# Regular Expressions

Regular expressions (regex) are patterns used to match, search, and manipulate text. They're powerful tools for form validation, text processing, and data extraction.

## Creating Regular Expressions

```javascript
// Literal notation
const regex1 = /pattern/flags;

// Constructor notation
const regex2 = new RegExp('pattern', 'flags');

// Examples
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dynamicPattern = new RegExp(userInput, 'i');
```

## Basic Patterns

### Literal Characters

```javascript
/hello/        // Matches "hello"
/JavaScript/   // Matches "JavaScript" (case-sensitive)
```

### Special Characters (Need Escaping)

```javascript
// These need backslash: . * + ? ^ $ { } [ ] \ | ( )
/\./           // Matches a literal dot
/\$/           // Matches a dollar sign
/\?/           // Matches a question mark
/\\/           // Matches a backslash
```

## Character Classes

```javascript
// Predefined classes
/\d/           // Any digit (0-9)
/\D/           // Any non-digit
/\w/           // Word character (a-z, A-Z, 0-9, _)
/\W/           // Non-word character
/\s/           // Whitespace (space, tab, newline)
/\S/           // Non-whitespace
/./            // Any character except newline

// Custom classes
/[abc]/        // a, b, or c
/[a-z]/        // Any lowercase letter
/[A-Z]/        // Any uppercase letter
/[0-9]/        // Any digit
/[a-zA-Z0-9]/  // Any alphanumeric
/[^abc]/       // NOT a, b, or c (negation)
```

## Quantifiers

```javascript
// How many times to match
/a*/           // 0 or more a's
/a+/           // 1 or more a's
/a?/           // 0 or 1 a
/a{3}/         // Exactly 3 a's
/a{2,5}/       // 2 to 5 a's
/a{2,}/        // 2 or more a's

// Examples
/\d+/          // One or more digits
/\w{3,10}/     // 3 to 10 word characters
/https?/       // "http" or "https"
```

### Greedy vs Lazy

```javascript
const text = '<div>content</div>';

// Greedy (default) - matches as much as possible
/<.+>/.exec(text)[0];    // '<div>content</div>'

// Lazy (add ?) - matches as little as possible
/<.+?>/.exec(text)[0];   // '<div>'
```

## Anchors and Boundaries

```javascript
/^hello/       // Starts with "hello"
/world$/       // Ends with "world"
/^exact$/      // Exactly "exact"
/\bword\b/     // Whole word "word"
/\Bword/       // "word" not at word boundary

// Examples
/^[A-Z]/.test('Hello');     // true (starts with capital)
/\.js$/.test('app.js');     // true (ends with .js)
/\bcat\b/.test('cats');     // false (not whole word)
/\bcat\b/.test('the cat');  // true
```

## Groups and Alternation

```javascript
// Groups
/(abc)+/           // One or more "abc"
/(\d{3})-(\d{4})/ // Phone number with capture groups

// Alternation (OR)
/cat|dog/          // "cat" or "dog"
/(red|blue) car/   // "red car" or "blue car"

// Non-capturing groups
/(?:abc)+/         // Groups without capturing

// Named groups
/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
```

## Flags

```javascript
/pattern/i     // Case-insensitive
/pattern/g     // Global (find all matches)
/pattern/m     // Multiline mode
/pattern/s     // Dotall (. matches newlines)
/pattern/u     // Unicode support
/pattern/y     // Sticky mode

// Combining flags
/hello/gi      // Case-insensitive, global

// Examples
'Hello HELLO hello'.match(/hello/gi);  // ['Hello', 'HELLO', 'hello']
```

## JavaScript Methods

### String Methods

```javascript
const text = 'The quick brown fox';

// test() - Returns boolean
/quick/.test(text);                    // true

// match() - Returns matches
text.match(/\w+/g);                    // ['The', 'quick', 'brown', 'fox']

// matchAll() - Returns iterator with groups
const matches = text.matchAll(/(\w+)/g);
for (const match of matches) {
    console.log(match[0], match.index);
}

// search() - Returns index
text.search(/brown/);                  // 10

// replace() - Replace matches
text.replace(/fox/, 'dog');            // 'The quick brown dog'
text.replace(/\w+/g, 'word');          // 'word word word word'

// replaceAll() - Replace all matches
'a-b-c'.replaceAll('-', '_');          // 'a_b_c'

// split() - Split by pattern
'a, b,  c'.split(/,\s*/);              // ['a', 'b', 'c']
```

### RegExp Methods

```javascript
const regex = /(\w+)@(\w+)\.(\w+)/;
const email = 'user@example.com';

// exec() - Returns detailed match
const result = regex.exec(email);
console.log(result[0]);   // 'user@example.com'
console.log(result[1]);   // 'user'
console.log(result[2]);   // 'example'
console.log(result[3]);   // 'com'
console.log(result.index); // 0
```

## Common Patterns

### Email Validation

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// More comprehensive
const strictEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

emailRegex.test('user@example.com');  // true
emailRegex.test('invalid-email');      // false
```

### Password Validation

```javascript
// At least 8 characters, 1 uppercase, 1 lowercase, 1 number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// With special character requirement
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

passwordRegex.test('Password1');  // true
passwordRegex.test('weak');       // false
```

### Phone Number

```javascript
// US format
const usPhone = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;

usPhone.test('(123) 456-7890');   // true
usPhone.test('123-456-7890');     // true
usPhone.test('1234567890');       // true
```

### URL

```javascript
const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;

urlRegex.test('https://example.com');           // true
urlRegex.test('http://sub.example.com/path');   // true
```

### Date

```javascript
// YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// DD/MM/YYYY or MM/DD/YYYY
const dateSlash = /^\d{2}\/\d{2}\/\d{4}$/;

dateRegex.test('2024-01-15');  // true
```

### Credit Card

```javascript
// Basic 16-digit check
const ccRegex = /^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/;

ccRegex.test('1234 5678 9012 3456');  // true
ccRegex.test('1234-5678-9012-3456');  // true
```

### Username

```javascript
// 3-20 characters, alphanumeric and underscores
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

usernameRegex.test('john_doe');   // true
usernameRegex.test('ab');         // false (too short)
```

## Advanced Techniques

### Lookahead and Lookbehind

```javascript
// Positive lookahead (?=)
/\d+(?= dollars)/.exec('100 dollars')[0];  // '100'

// Negative lookahead (?!)
/\d+(?! dollars)/.exec('100 euros')[0];    // '100'

// Positive lookbehind (?<=)
/(?<=\$)\d+/.exec('$100')[0];               // '100'

// Negative lookbehind (?<!)
/(?<!\$)\d+/.exec('€100')[0];               // '100'
```

### Named Capture Groups

```javascript
const dateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = dateRegex.exec('2024-01-15');

console.log(match.groups.year);   // '2024'
console.log(match.groups.month);  // '01'
console.log(match.groups.day);    // '15'

// With replace
'2024-01-15'.replace(dateRegex, '$<month>/$<day>/$<year>');
// '01/15/2024'
```

### Backreferences

```javascript
// Match repeated words
const repeated = /\b(\w+)\s+\1\b/;
repeated.test('the the');       // true
repeated.test('the quick');     // false

// Match same quote type
const quoted = /(['"])(.*?)\1/;
quoted.test('"hello"');         // true
quoted.test("'world'");         // true
```

## Text Processing Examples

### Extract All Links

```javascript
const html = '<a href="https://example.com">Link 1</a><a href="https://other.com">Link 2</a>';
const linkRegex = /href="([^"]+)"/g;
const links = [...html.matchAll(linkRegex)].map(m => m[1]);
// ['https://example.com', 'https://other.com']
```

### Replace Multiple Spaces

```javascript
const text = 'Hello    World   !';
text.replace(/\s+/g, ' ');  // 'Hello World !'
```

### Trim Whitespace

```javascript
const text = '  hello world  ';
text.replace(/^\s+|\s+$/g, '');  // 'hello world'
// Or use: text.trim()
```

### Convert Case

```javascript
// camelCase to kebab-case
'camelCaseString'.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
// 'camel-case-string'

// kebab-case to camelCase
'kebab-case-string'.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
// 'kebabCaseString'
```

### Highlight Search Terms

```javascript
function highlight(text, searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

highlight('The quick brown fox', 'quick');
// 'The <mark>quick</mark> brown fox'
```

## Performance Tips

```javascript
// Compile regex once if used repeatedly
const regex = /pattern/;  // Outside loop

for (const item of items) {
    if (regex.test(item)) {
        // Process match
    }
}

// Avoid catastrophic backtracking
// ❌ Bad: nested quantifiers
/(\w+)+$/

// ✅ Good: atomic grouping (use possessive if available)
/\w+$/
```

## Regex Cheat Sheet

| Pattern | Description |
|---------|-------------|
| `.` | Any character except newline |
| `\d` | Digit [0-9] |
| `\w` | Word character [a-zA-Z0-9_] |
| `\s` | Whitespace |
| `^` | Start of string |
| `$` | End of string |
| `*` | 0 or more |
| `+` | 1 or more |
| `?` | 0 or 1 |
| `{n}` | Exactly n times |
| `{n,m}` | Between n and m times |
| `[abc]` | Character class |
| `[^abc]` | Negated class |
| `(...)` | Capture group |
| `(?:...)` | Non-capturing group |
| `\|` | Alternation (OR) |
| `\b` | Word boundary |

## Summary

- Regular expressions match patterns in text
- Use character classes and quantifiers for flexibility
- Anchors define position in the string
- Groups capture parts of matches
- Flags modify matching behavior
- Test patterns thoroughly
- Be mindful of performance

## What's Next?

You now have a comprehensive understanding of web development fundamentals. Start building with the [HTML Tutorial](/guide/html/) or explore other topics in the guide.
