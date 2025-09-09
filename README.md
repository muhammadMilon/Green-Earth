## Questions and Answers

### 1. What is the difference between var, let, and const?

**var:**
- Function-scoped or globally-scoped
- Can be redeclared and reassigned
- Hoisted to the top of their scope (initialized as undefined)
- Can cause issues with closures in loops

**let:**
- Block-scoped
- Cannot be redeclared in the same scope, but can be reassigned
- Hoisted but not initialized (temporal dead zone)
- Better for variables that need to change

**const:**
- Block-scoped
- Cannot be redeclared or reassigned
- Must be initialized at declaration
- Hoisted but not initialized (temporal dead zone)
- Best for values that shouldn't change

```javascript
var x = 1;  // Function/global scoped
let y = 2;  // Block scoped, can reassign
const z = 3; // Block scoped, cannot reassign
```

### 2. What is the difference between map(), forEach(), and filter()?

**map():**
- Creates a new array by transforming each element
- Returns a new array of the same length
- Does not mutate the original array

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

**forEach():**
- Executes a function for each array element
- Returns undefined
- Used for side effects, not transformation

```javascript
const numbers = [1, 2, 3];
numbers.forEach(x => console.log(x)); // Prints: 1, 2, 3
```

**filter():**
- Creates a new array with elements that pass a test
- Returns a new array (potentially shorter)
- Does not mutate the original array

```javascript
const numbers = [1, 2, 3, 4];
const evens = numbers.filter(x => x % 2 === 0); // [2, 4]
```

### 3. What are arrow functions in ES6?

Arrow functions are a concise way to write functions introduced in ES6:

**Features:**
- Shorter syntax
- Implicit return for single expressions
- Lexical `this` binding (inherits `this` from enclosing scope)
- Cannot be used as constructors
- No `arguments` object

```javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Arrow function with block body
const add = (a, b) => {
    return a + b;
};

// Single parameter (parentheses optional)
const square = x => x * x;

// No parameters
const greet = () => console.log('Hello!');
```

### 4. How does destructuring assignment work in ES6?

Destructuring allows unpacking values from arrays or properties from objects into distinct variables:

**Array Destructuring:**
```javascript
const fruits = ['apple', 'banana', 'orange'];
const [first, second, third] = fruits;
// first = 'apple', second = 'banana', third = 'orange'

// Skip elements
const [first, , third] = fruits;
// first = 'apple', third = 'orange'

// Default values
const [a, b, c = 'default'] = ['x', 'y'];
// a = 'x', b = 'y', c = 'default'
```

**Object Destructuring:**
```javascript
const person = { name: 'John', age: 30, city: 'New York' };
const { name, age } = person;
// name = 'John', age = 30

// Rename variables
const { name: fullName, age: years } = person;
// fullName = 'John', years = 30

// Default values
const { name, country = 'USA' } = person;
// name = 'John', country = 'USA'
```

**Nested Destructuring:**
```javascript
const user = {
    profile: {
        name: 'Alice',
        settings: { theme: 'dark' }
    }
};
const { profile: { name, settings: { theme } } } = user;
// name = 'Alice', theme = 'dark'
```

### 5. Explain template literals in ES6. How are they different from string concatenation?

Template literals are string literals allowing embedded expressions, enclosed by backticks (`) instead of quotes:

**Features:**
- Multi-line strings without escape characters
- Embedded expressions using `${}`
- Better readability
- Tagged templates for advanced processing

```javascript
// Traditional string concatenation
const name = 'John';
const age = 30;
const message = 'Hello, my name is ' + name + ' and I am ' + age + ' years old.';

// Template literals
const message = `Hello, my name is ${name} and I am ${age} years old.`;

// Multi-line strings
const html = `
    <div>
        <h1>${title}</h1>
        <p>${description}</p>
    </div>
`;

// Expressions in templates
const price = 19.99;
const tax = 0.1;
const total = `Total: $${(price * (1 + tax)).toFixed(2)}`;

// Tagged templates
function highlight(strings, ...values) {
    return strings.reduce((result, string, i) => 
        result + string + (values[i] ? `<mark>${values[i]}</mark>` : ''), '');
}
const highlighted = highlight`The price is ${price} with ${tax * 100}% tax`;
```

**Differences from String Concatenation:**
1. **Readability**: Template literals are more readable, especially with multiple variables
2. **Performance**: Generally faster than string concatenation
3. **Multi-line**: Native support for multi-line strings
4. **Expression evaluation**: Can embed any JavaScript expression
5. **Escaping**: Less need for escape characters

## Project Structure

```
green-earth/
├── index.html          # Main HTML file
├── script.js          # JavaScript functionality
├── README.md          # Project documentation
└── [deployment files] # Generated during build
```

## Setup Instructions

1. Clone the repository
2. Open `index.html` in a web browser
3. The website will automatically load plant data from the APIs
4. No build process required - it's pure HTML, CSS, and JavaScript!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.