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
const path = require("path");
const fs = require("fs/promises");
const simple_git_1 = require("simple-git");
const openai_service_1 = require("../open_ai/openai.service");
let CronService = CronService_1 = class CronService {
    openAiService;
    logger = new common_1.Logger(CronService_1.name);
    constructor(openAiService) {
        this.openAiService = openAiService;
    }
    checkDeploymentCost() {
        this.logger.log('💰 Checking deployment cost...');
    }
    async triggerCommit(commitDto) {
        const { repoUrl, repoBranch, githubToken, githubName, githubEmail } = commitDto;
        const repoDir = path.join(process.cwd(), 'temp/code-challenge-v2');
        try {
            this.logger.log('📥 Cloning repo...');
            await (0, simple_git_1.default)().clone(this.addTokenToUrl(repoUrl, githubToken), repoDir);
            const isRepo = await this.checkIfGitRepo(repoDir);
            if (!isRepo) {
                this.logger.error('❌ Cloned directory is not a valid git repository');
                return;
            }
            const allFiles = await this.getAllFiles(repoDir);
            if (allFiles.length === 0) {
                this.logger.warn('⚠️ No suitable files found to refactor.');
                return;
            }
            const randomFile = allFiles[Math.floor(Math.random() * allFiles.length)];
            this.logger.log(`🛠️ Refactoring file: ${randomFile}`);
            const commitMessage = await this.openAiService.refactorFile(randomFile);
            if (!commitMessage) {
                this.logger.warn('There is some problem with AI response, commitMessage is empty');
                return;
            }
            const git = (0, simple_git_1.default)(repoDir);
            await git.addConfig('user.name', githubName);
            await git.addConfig('user.email', githubEmail);
            await git.add('.');
            await git.commit(commitMessage);
            await git.push('origin', repoBranch);
            this.logger.log('✅ Commit & push successful');
            await fs.rm(repoDir, { recursive: true, force: true });
        }
        catch (error) {
            this.logger.error(`❌ Commit task failed: ${error.message}`);
        }
    }
    addTokenToUrl(url, token) {
        return url.replace('https://', `https://${token}@`);
    }
    async checkIfGitRepo(dir) {
        try {
            return await (0, simple_git_1.default)(dir).checkIsRepo();
        }
        catch (error) {
            this.logger.warn(`⚠️ Git repo check failed: ${error.message}`);
            return false;
        }
    }
    async getAllFiles(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(entries.map(async (entry) => {
            const fullPath = path.resolve(dir, entry.name);
            if (entry.isDirectory()) {
                if (['node_modules', 'dist', '.git', '.github', '.gitignore', 'package-lock.json', 'package.json'].includes(entry.name))
                    return [];
                return this.getAllFiles(fullPath);
            }
            else {
                return [fullPath];
            }
        }));
        return files.flat().filter(f => !f.endsWith('.lock') && !f.endsWith('.png'));
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CronService.prototype, "checkDeploymentCost", null);
exports.CronService = CronService = CronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openai_service_1.OpenAiService])
], CronService);
//# sourceMappingURL=cron.service.js.map