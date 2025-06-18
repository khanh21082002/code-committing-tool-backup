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
const fs = require("fs/promises");
const axios_1 = require("axios");
let OpenAiService = OpenAiService_1 = class OpenAiService {
    logger = new common_1.Logger(OpenAiService_1.name);
    apiKey = process.env.GROQ_API_KEY;
    endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    async refactorFile(filePath) {
        try {
            const originalCode = await fs.readFile(filePath, 'utf-8');
            this.logger.log(`🔁 Sending code to Groq for refactoring: ${filePath}`);
            const response = await axios_1.default.post(this.endpoint, {
                model: 'distil-whisper-large-v3-en',
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
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            const updatedRaw = response.data.choices?.[0]?.message?.content;
            if (!updatedRaw) {
                this.logger.warn('⚠️ No response from Groq');
                return false;
            }
            const updatedCode = this.extractCodeBlock(updatedRaw);
            await fs.writeFile(filePath, updatedCode, 'utf-8');
            this.logger.log(`✅ Refactored file saved: ${filePath}`);
            return true;
        }
        catch (error) {
            this.logger.error(`❌ Failed to refactor: ${error.message}`);
            if (error.response?.data) {
                this.logger.error('🔍 Groq response:', JSON.stringify(error.response.data, null, 2));
            }
            return false;
        }
    }
    extractCodeBlock(text) {
        const match = text.match(/```(?:\w*\n)?([\s\S]*?)```/);
        return match ? match[1].trim() : text.trim();
    }
};
exports.OpenAiService = OpenAiService;
exports.OpenAiService = OpenAiService = OpenAiService_1 = __decorate([
    (0, common_1.Injectable)()
], OpenAiService);
//# sourceMappingURL=openai.service.js.map