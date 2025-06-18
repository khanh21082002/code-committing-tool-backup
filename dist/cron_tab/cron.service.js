"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const openai_service_1 = require("../open_ai/openai.service");
const path = require("path");
const fs = require("fs/promises");
const simpleGit = require("simple-git");
let CronService = CronService_1 = class CronService {
    openAiService;
    logger = new common_1.Logger(CronService_1.name);
    git = simpleGit.default();
    constructor(openAiService) {
        this.openAiService = openAiService;
    }
    async handleCron() {
        const testFile = path.join(__dirname, '../src/demo.ts');
        try {
            await this.openAiService.refactorFile(testFile);
            await this.git.add('.');
            await this.git.commit(`refactor: auto-improve ${path.basename(testFile)}`);
            await this.git.push('origin', 'main');
            this.logger.log('✅ Commit and push successful!');
        }
        catch (error) {
            this.logger.error(`❌ Cron task failed: ${error.message}`);
        }
    }
    async getAllTsFiles(dir) {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map(async (dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? this.getAllTsFiles(res) : res;
        }));
        return files.flat().filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'));
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "handleCron", null);
exports.CronService = CronService = CronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openai_service_1.OpenAiService])
], CronService);
//# sourceMappingURL=cron.service.js.map