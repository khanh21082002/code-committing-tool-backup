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
const prompt_1 = require("./prompt");
let OpenAiService = OpenAiService_1 = class OpenAiService {
    logger = new common_1.Logger(OpenAiService_1.name);
    apiKey = process.env.GROQ_API_KEY;
    endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    async refactorFile(filePath) {
        try {
            const originalCode = await fs.readFile(filePath, 'utf-8');
            this.logger.log(`🔁 Sending code to Groq for refactoring: ${filePath}`);
            const randomPrompt = prompt_1.PROMPTS[Math.floor(Math.random() * prompt_1.PROMPTS.length)];
            const response = await axios_1.default.post(this.endpoint, {
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
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            const updatedRaw = response.data.choices?.[0]?.message?.content;
            if (!updatedRaw) {
                this.logger.warn('⚠️ No response from Groq');
            }
            this.logger.log('Raw Response from Groq:', updatedRaw);
            const updatedCode = this.extractCodeBlock(updatedRaw);
            this.logger.log('Updated Code:', updatedCode);
            await fs.writeFile(filePath, updatedCode, 'utf-8');
            this.logger.log(`✅ Refactored file saved: ${filePath}`);
            const commitMsgResponse = await axios_1.default.post(this.endpoint, {
                model: 'deepseek-r1-distill-llama-70b',
                messages: [
                    { role: 'system', content: 'You are a Git expert assistant with excellent commit message writing skills.' },
                    { role: 'user', content: `Generate a short commit message. Use concise format like: "refactor: simplify CSS center layout", also not including greetings or explanations for the following code:\n\n${updatedCode.slice(0, 1000)}` },
                ],
                temperature: 0.5,
                top_p: 1.0,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            const rawCommitMessage = commitMsgResponse.data.choices?.[0]?.message?.content;
            const commitMessage = this.extractCommitMessage(rawCommitMessage);
            this.logger.log('Commit Message:', commitMessage);
            return commitMessage;
        }
        catch (error) {
            this.logger.error(`❌ Failed to refactor: ${error.message}`);
            if (error.response?.data) {
                this.logger.error('🔍 Groq response:', JSON.stringify(error.response.data, null, 2));
            }
        }
    }
    extractCodeBlock(text) {
        const match = text.match(/```(?:\w*\n)?([\s\S]*?)```/);
        return match ? match[1].trim() : text.trim();
    }
    extractCommitMessage(text) {
        const cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        const lines = cleaned.split('\n').map(line => line.trim()).filter(line => line);
        const commitLine = lines.find(line => /^[a-z]+(\([\w-]+\))?:\s.+/.test(line));
        return commitLine || lines[lines.length - 1] || '';
    }
};
exports.OpenAiService = OpenAiService;
exports.OpenAiService = OpenAiService = OpenAiService_1 = __decorate([
    (0, common_1.Injectable)()
], OpenAiService);
//# sourceMappingURL=openai.service.js.map