import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as path from 'path';
import * as fs from 'fs/promises';
import simpleGit from 'simple-git';
import { OpenAiService } from '../open_ai/openai.service';
import { CommitDto } from '../commit/dto/commit.dto';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly openAiService: OpenAiService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  checkDeploymentCost() {
    this.logger.log('💰 Checking deployment cost...');
  }

  async triggerCommit(commitDto: CommitDto) {
    const { repoUrl, repoBranch, githubToken, githubName, githubEmail } = commitDto;
    const repoDir = path.join(process.cwd(), 'temp/code-challenge-v2');

    try {
      this.logger.log('📥 Cloning repo...');
      await simpleGit().clone(this.addTokenToUrl(repoUrl, githubToken), repoDir);

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

      const git = simpleGit(repoDir);
      await git.addConfig('user.name', githubName);
      await git.addConfig('user.email', githubEmail);
      await git.add('.');
      await git.commit(commitMessage);
      await git.push('origin', repoBranch);

      this.logger.log('✅ Commit & push successful');
      await fs.rm(repoDir, { recursive: true, force: true });
    } catch (error) {
      this.logger.error(`❌ Commit task failed: ${error.message}`);
    }
  }

  private addTokenToUrl(url: string, token: string): string {
    return url.replace('https://', `https://${token}@`);
  }

  private async checkIfGitRepo(dir: string): Promise<boolean> {
    try {
      return await simpleGit(dir).checkIsRepo();
    } catch (error) {
      this.logger.warn(`⚠️ Git repo check failed: ${error.message}`);
      return false;
    }
  }

  private async getAllFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.resolve(dir, entry.name);
        if (entry.isDirectory()) {
          if (['node_modules', 'dist', '.git', '.github', '.gitignore', 'package-lock.json', 'package.json'].includes(entry.name)) return [];
          return this.getAllFiles(fullPath);
        } else {
          return [fullPath];
        }
      }),
    );
    return files.flat().filter(f => !f.endsWith('.lock') && !f.endsWith('.png'));
  }
}

