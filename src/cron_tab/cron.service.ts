import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.logger.log('✅ Cron is running every minute!');
  }
}
