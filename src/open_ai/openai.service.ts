import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import axios from 'axios';
import { PROMPTS } from './prompt';
import path from 'path/win32';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly apiKey = process.env.GROQ_API_KEY;
  private readonly endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  async refactorFile(filePath: string): Promise<string | void> {
    try {
      const originalCode = await fs.readFile(filePath, 'utf-8');

      this.logger.log(`🔁 Sending code to Groq for refactoring: ${filePath}`);

      const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];

      const response = await axios.post(
        this.endpoint,
        {
          model: 'deepseek-r1-distill-llama-70b',
          messages: [
            {
              role: 'system',
              content: 'You are a senior engineer with many years of experience in software development.',
            },
            {
              role: 'user',
              content: `${randomPrompt.instruction}\n\n${originalCode.slice(0, 5000)}`,
            },
          ],
          temperature: 0.5,
          top_p: 1.0,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const updatedRaw = response.data.choices?.[0]?.message?.content;

      if (!updatedRaw) {
        this.logger.warn('⚠️ No response from Groq');
      }
      this.logger.log('Raw Response from Groq:', updatedRaw);

      const updatedCode = this.extractCodeBlock(updatedRaw);
      this.logger.log('Updated Code:', updatedCode);

      await fs.writeFile(filePath, updatedCode, 'utf-8');
      this.logger.log(`✅ Refactored file saved: ${filePath}`);

            // Generate commit message
      const commitMsgResponse = await axios.post(
        this.endpoint,
        {
          model: 'deepseek-r1-distill-llama-70b',
          messages: [
            { role: 'system', content: 'You are a Git expert assistant with excellent commit message writing skills.' },
            { role: 'user', content: `Generate a short commit message. Use concise format like: "refactor: simplify CSS center layout", also not including greetings or explanations for the following code:\n\n${updatedCode.slice(0, 1000)}` },
          ],
          temperature: 0.5,
          top_p: 1.0,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const rawCommitMessage = commitMsgResponse.data.choices?.[0]?.message?.content;
      const commitMessage = this.extractCommitMessage(rawCommitMessage);
      this.logger.log('Commit Message:', commitMessage);
      return commitMessage;
    } catch (error) {
      this.logger.error(`❌ Failed to refactor: ${error.message}`);
      if (error.response?.data) {
        this.logger.error('🔍 Groq response:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }

  private extractCodeBlock(text: string): string {
    const match = text.match(/```(?:\w*\n)?([\s\S]*?)```/);
    return match ? match[1].trim() : text.trim();
  }

  private extractCommitMessage(text: string): string {
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  const lines = cleaned.split('\n').map(line => line.trim()).filter(line => line);

  const commitLine = lines.find(line =>
    /^[a-z]+(\([\w-]+\))?:\s.+/.test(line),
  );

  return commitLine || lines[lines.length - 1] || '';
}

}

