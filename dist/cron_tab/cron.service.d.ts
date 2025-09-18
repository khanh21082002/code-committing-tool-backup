import { OpenAiService } from '../open_ai/openai.service';
import { CommitDto } from '../commit/dto/commit.dto';
export declare class CronService {
    private readonly openAiService;
    private readonly logger;
    constructor(openAiService: OpenAiService);
    checkDeploymentCost(): void;
    triggerCommit(commitDto: CommitDto): Promise<void>;
    private addTokenToUrl;
    private checkIfGitRepo;
    private getAllFiles;
}
