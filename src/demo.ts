/**
 * Generates a personalized greeting message
 * 
 * @param name The name to include in the greeting
 * @param greeting The greeting text to use (defaults to 'Hello')
 * @returns A formatted greeting string
 * 
 * @example
 * greet('Alice') // returns 'Hello Alice'
 * greet('Hi', 'Bob') // returns 'Hi Bob'
 */
export function greet(
  name: string,
  greeting: string = 'Hello'
): string {
  return `${greeting} ${name}`;
}