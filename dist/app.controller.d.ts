import { AppService } from './app.service';
import { CronService } from './cron_tab/cron.service';
import { CommitDto } from './commit/dto/commit.dto';
export declare class AppController {
    private readonly appService;
    private readonly cronService;
    constructor(appService: AppService, cronService: CronService);
    getHello(): string;
    triggerCommit(commitDto: CommitDto): Promise<string>;
}
