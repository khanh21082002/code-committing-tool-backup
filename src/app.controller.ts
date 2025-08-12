import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CronService } from './cron_tab/cron.service';
import { CommitDto } from './commit/dto/commit.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Commit')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cronService: CronService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('commit')
  @ApiOperation({ summary: 'Trigger a code commit with provided repository details' })
  @ApiResponse({ status: 200, description: 'Commit process initiated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async triggerCommit(@Body() commitDto: CommitDto): Promise<string> {
    this.cronService.triggerCommit(commitDto);
    return 'Commit process initiated. Check logs for details.';
  }
}
