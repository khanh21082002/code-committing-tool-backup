export declare class OpenAiService {
    private readonly logger;
    private readonly apiKey;
    private readonly endpoint;
    refactorFile(filePath: string): Promise<string | void>;
    private extractCodeBlock;
    private extractCommitMessage;
}
