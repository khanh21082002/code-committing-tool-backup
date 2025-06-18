import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as fs from 'fs/promises';
import axios from 'axios';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly apiKey = process.env.GROQ_API_KEY;
  private readonly endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  async refactorFile(filePath: string): Promise<void> {
    try {
      const originalCode = await fs.readFile(filePath, 'utf-8');

      this.logger.log(`🔁 Sending code to Groq for refactoring: ${filePath}`);

      const response = await axios.post(
        this.endpoint,
        {
          model: 'mixtral-8x7b-32768', // hoặc mistral-7b nếu muốn nhỏ hơn
          messages: [
            {
              role: 'system',
              content:
                'You are a senior software engineer. Refactor the code for better readability without changing its behavior.',
            },
            {
              role: 'user',
              content: `Refactor this code:\n\n${originalCode}`,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const updatedCode = response.data.choices?.[0]?.message?.content;

      if (!updatedCode) {
        this.logger.warn('⚠️ No response from Groq');
        return;
      }

      await fs.writeFile(filePath, updatedCode, 'utf-8');
      this.logger.log(`✅ Refactored file saved: ${filePath}`);
    } catch (error) {
      this.logger.error(`❌ Failed to refactor: ${error.message}`);
    }
  }
}
