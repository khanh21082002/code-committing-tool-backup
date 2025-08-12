import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron_tab/cron.service'; 
import { OpenAiService } from './open_ai/openai.service'; // Ensure this import matches your actual service path

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, CronService, OpenAiService],
})
export class AppModule {}


// import { Module } from '@nestjs/common';
// import { OpenAiService } from './open_ai/openai.service';
// import { CronService } from './cron_tab/cron.service';

// @Module({
//   providers: [OpenAiService, CronService],
// })
// export class AppModule {}
