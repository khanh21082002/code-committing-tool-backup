import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as fs from 'fs/promises';

@Injectable()
export class OpenAiService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  private readonly logger = new Logger(OpenAiService.name);

  async refactorFile(filePath: string): Promise<void> {
    try {
      const originalCode = await fs.readFile(filePath, 'utf-8');

      this.logger.log(`🔁 Sending code to OpenAI for refactoring: ${filePath}`);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a senior software engineer who refactors code for clarity and maintainability.',
          },
          {
            role: 'user',
            content: `Refactor the following code and improve it without changing its behavior:\n\n${originalCode}`,
          },
        ],
        temperature: 0.5,
      });

      const updatedCode = completion.choices?.[0]?.message?.content;

      if (!updatedCode) {
        this.logger.warn('⚠️ OpenAI returned empty or invalid response.');
        return;
      }

      await fs.writeFile(filePath, updatedCode, 'utf-8');
      this.logger.log(`✅ File refactored successfully: ${filePath}`);
    } catch (error) {
      this.logger.error(`❌ Failed to refactor file: ${filePath} - ${error.message}`);
    }
  }
}
