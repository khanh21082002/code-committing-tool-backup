import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  commitCode(): string {
    // Logic for committing code would go here
    return 'Code committed successfully!';
  }
}
