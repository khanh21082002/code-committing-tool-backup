import { OpenAiService } from '../open_ai/openai.service';
export declare class CronService {
    private readonly openAiService;
    private readonly logger;
    private readonly git;
    constructor(openAiService: OpenAiService);
    handleCron(): Promise<void>;
    private getAllTsFiles;
}
