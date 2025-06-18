/**
 * Generates a personalized greeting message
 * 
 * @param greeting The greeting text to use (defaults to 'Hello')
 * @param name The name to include in the greeting
 * @returns A formatted greeting string
 * 
 * @example
 * greet('Alice') // returns 'Hello Alice'
 * greet('Hi', 'Bob') // returns 'Hi Bob'
 */
export function greet(
  greeting: string = 'Hello',
  name: string
): string {
  return `${greeting} ${name}`;
}