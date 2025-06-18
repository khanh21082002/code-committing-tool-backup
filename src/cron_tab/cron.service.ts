import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OpenAiService } from '../open_ai/openai.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as simpleGit from 'simple-git';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private readonly git = simpleGit.default();

  constructor(private readonly openAiService: OpenAiService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    // const srcDir = path.join(__dirname, '../src');
    const testFile = path.join(__dirname, '../src/demo.ts');
    
    // const allFiles = await this.getAllTsFiles(testFile);

    // if (allFiles.length === 0) {
    //   this.logger.warn('❌ No .ts files found to refactor.');
    //   return;
    // }

    // const randomFile = allFiles[Math.floor(Math.random() * allFiles.length)];
    // this.logger.log(`🎯 Refactoring file: ${randomFile}`);

    try {
      await this.openAiService.refactorFile(testFile);
      await this.git.add('.');
      await this.git.commit(`refactor: auto-improve ${path.basename(testFile)}`);
      await this.git.push('origin', 'main');
      this.logger.log('✅ Commit and push successful!');
    } catch (error) {
      this.logger.error(`❌ Cron task failed: ${error.message}`);
    }
  }

  private async getAllTsFiles(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map(async (dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? this.getAllTsFiles(res) : res;
      }),
    );
    return files.flat().filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'));
  }
}
