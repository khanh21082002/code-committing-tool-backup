// import { Injectable, Logger } from '@nestjs/common';
// import { OpenAI } from 'openai';
// import * as fs from 'fs/promises';

// @Injectable()
// export class OpenAiService {
//   private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//   private readonly logger = new Logger(OpenAiService.name);

//   async refactorFile(filePath: string): Promise<void> {
//     try {
//       const originalCode = await fs.readFile(filePath, 'utf-8');

//       this.logger.log(`🔁 Sending code to OpenAI for refactoring: ${filePath}`);

//       const completion = await this.openai.chat.completions.create({
//         model: 'gpt',
//         messages: [
//           {
//             role: 'system',
//             content: 'You are a senior software engineer who refactors code for clarity and maintainability.',
//           },
//           {
//             role: 'user',
//             content: `Refactor the following code and improve it without changing its behavior:\n\n${originalCode}`,
//           },
//         ],
//         temperature: 0.5,
//       });

//       const updatedCode = completion.choices?.[0]?.message?.content;

//       if (!updatedCode) {
//         this.logger.warn('⚠️ OpenAI returned empty or invalid response.');
//         return;
//       }

//       await fs.writeFile(filePath, updatedCode, 'utf-8');
//       this.logger.log(`✅ File refactored successfully: ${filePath}`);
//     } catch (error) {
//       this.logger.error(`❌ Failed to refactor file: ${filePath} - ${error.message}`);
//     }
//   }
// }



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
          model: 'deepseek-r1-distill-llama-70b',
          messages: [
            {
              role: 'system',
              content: 'You are a senior engineer. Refactor the code for clarity and maintainability. Only return the modified code.',
            },
            {
              role: 'user',
              content: `Refactor this TypeScript code:\n\n${originalCode.slice(0, 4000)}`,
            },
          ],
          temperature: 0.5,
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

      const updatedCode = this.extractCodeBlock(updatedRaw);

      await fs.writeFile(filePath, updatedCode, 'utf-8');
      this.logger.log(`✅ Refactored file saved: ${filePath}`);
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
}

