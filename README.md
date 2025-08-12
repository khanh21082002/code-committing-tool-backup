# Automated AI Code Committing Tool

This repository contains a NestJS application designed to automate code refactoring and committing using AI. The tool continuously monitors a specified Git repository, applies AI-driven refactoring to random files, and automatically commits and pushes the changes back.

## Features

*   **Automated Code Refactoring:** Utilizes the Groq API with the `deepseek-r1-distill-llama-70b` model to refactor code.
*   **Automated Commit Message Generation:** Generates concise and relevant Git commit messages based on the AI-refactored code.
*   **Scheduled Operations:** Runs as a cron job, periodically pulling the target repository, refactoring a file, and pushing changes.
*   **Git Integration:** Seamlessly interacts with Git repositories for cloning, committing, and pushing.
*   **Configurable:** Easily configured via environment variables for target repository, Git credentials, and AI API keys.

## Architecture

The application is built with NestJS and follows a modular architecture:

*   **`CronService`:** Manages the scheduled tasks. Every 10 seconds, it orchestrates the cloning of the target repository, selection of a random file, invocation of the AI refactoring service, and Git operations (commit and push).
*   **`OpenAiService`:** Acts as the interface for AI interactions. It communicates with the Groq API to perform code refactoring and generate commit messages.
*   **Git Integration:** Leverages the `simple-git` library to perform all necessary Git commands.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <this-repository-url>
    cd code-committing-tool
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory of the project and add the following environment variables:

    ```env
    TARGET_REPO_URL=<Your-Target-Git-Repository-URL>
    TARGET_REPO_BRANCH=main # Or your desired branch, e.g., 'master'
    GITHUB_TOKEN=<Your-GitHub-Personal-Access-Token>
    GITHUB_NAME=<Your-Git-User-Name>
    GITHUB_EMAIL=<Your-Git-User-Email>
    GROQ_API_KEY=<Your-Groq-API-Key>
    ```
    *   `TARGET_REPO_URL`: The URL of the Git repository you want the tool to refactor.
    *   `TARGET_REPO_BRANCH`: The branch to push changes to (default is `main`).
    *   `GITHUB_TOKEN`: A GitHub Personal Access Token with `repo` scope to allow the tool to clone and push to your repository.
    *   `GITHUB_NAME`: The Git user name to be used for commits.
    *   `GITHUB_EMAIL`: The Git user email to be used for commits.
    *   `GROQ_API_KEY`: Your API key for the Groq API.

4.  **Run the application:**

    *   **Development mode (with watch):**
        ```bash
        npm run start:dev
        ```
    *   **Production mode:**
        ```bash
        npm run start:prod
        ```

## Important Notes

*   The tool will clone the target repository into a `temp/code-challenge-v2` directory within the project's root. This directory will be removed after each successful commit and push.
*   Ensure your `GITHUB_TOKEN` has the necessary permissions to clone and push to the `TARGET_REPO_URL`.
*   The AI refactoring is applied to a *randomly selected file* from the target repository.
*   The AI model used is `deepseek-r1-distill-llama-70b` via the Groq API.