"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OpenAiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const fs = require("fs/promises");
let OpenAiService = OpenAiService_1 = class OpenAiService {
    openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    logger = new common_1.Logger(OpenAiService_1.name);
    async refactorFile(filePath) {
        try {
            const originalCode = await fs.readFile(filePath, 'utf-8');
            this.logger.log(`🔁 Sending code to OpenAI for refactoring: ${filePath}`);
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
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
        }
        catch (error) {
            this.logger.error(`❌ Failed to refactor file: ${filePath} - ${error.message}`);
        }
    }
};
exports.OpenAiService = OpenAiService;
exports.OpenAiService = OpenAiService = OpenAiService_1 = __decorate([
    (0, common_1.Injectable)()
], OpenAiService);
//# sourceMappingURL=openai.service.js.map