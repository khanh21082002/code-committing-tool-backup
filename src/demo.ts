<think>
Okay, so I need to refactor this code for better readability without changing its behavior. Let me look at the code provided. It's a function called greet that takes a name as a string and returns "Hello " concatenated with the name.

Hmm, the current code uses string concatenation with a plus sign. I remember that in ES6, template literals were introduced, which use backticks and ${} to embed variables. That makes the code cleaner and more readable, especially when dealing with multiple variables or longer strings.

So, the main idea is to replace the string concatenation with a template literal. That should make the code look simpler and easier to read. Let me think about how to do that.

The original function is:
export function greet(name: string) {
  return "Hello " + name;
}

I can rewrite the return statement using backticks. So it would be `Hello ${name}`. That way, it's more concise and readable.

I should check if there are any other improvements possible. Maybe using arrow functions, but since it's a function with a single parameter and a single statement, it could be written as an arrow function. However, the original is using a named export function, which is good for readability and debugging, so maybe keeping it as a regular function is better.

Wait, the user is a senior software engineer, so they might prefer the function to remain a regular function for clarity. So I'll keep it as a function declaration.

Putting it all together, the refactored code would export the function greet, take a string name, and return the template literal with the name embedded.

I think that's the main change needed. It should improve readability without altering the functionality.
</think>

I'll refactor the code to use template literals for improved readability:

```typescript
export function greet(name: string) {
  return `Hello ${name}`;
}
```

The changes made:
1. Replaced string concatenation with template literals using backticks
2. Embedded the `name` parameter directly in the string using `${}`
3. Maintained the same functionality while improving code readability

This refactoring makes the code cleaner and more modern while preserving its original behavior.