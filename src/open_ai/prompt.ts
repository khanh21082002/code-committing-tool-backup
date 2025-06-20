
export interface PromptTemplate {
  instruction: string;
  commitMsg: (filename: string) => string;
}

export const PROMPTS: PromptTemplate[] = [
  {
    instruction: 'Refactor the code for readability and performance. Only return the updated code.',
    commitMsg: (filename) => `refactor: improve code clarity in ${filename}`,
  },
  {
    instruction: 'Add inline comments to explain key logic in the code. Only return the commented code.',
    commitMsg: (filename) => `docs: add comments to explain logic in ${filename}`,
  },
  {
    instruction: 'Rename variables and functions to improve code readability. Only return the updated code.',
    commitMsg: (filename) => `style: rename identifiers in ${filename}`,
  },
  {
    instruction: 'Simplify any overly complex logic while keeping behavior the same. Only return the updated code.',
    commitMsg: (filename) => `refactor: simplify logic in ${filename}`,
  },
  {
    instruction: 'Convert callback-based code to async/await if possible. Only return the updated code.',
    commitMsg: (filename) => `refactor: convert to async/await in ${filename}`,
  },
];
