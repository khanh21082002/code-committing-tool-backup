import { IsString, IsNotEmpty, IsUrl, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommitDto {
  @ApiProperty({
    description: 'URL of the target Git repository',
    example: 'https://github.com/username/repo.git' // Dummy data
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  repoUrl: string;

  @ApiProperty({
    description: 'Branch of the target Git repository',
    example: 'main'
  })
  @IsString()
  @IsNotEmpty()
  repoBranch: string;

  @ApiProperty({
    description: 'GitHub Personal Access Token',
    example: 'your_github_token_here'
  })
  @IsString()
  @IsNotEmpty()
  githubToken: string;

  @ApiProperty({
    description: 'GitHub user name for commits',
    example: 'your_github_username_here'
  })
  @IsString()
  @IsNotEmpty()
  githubName: string;

  @ApiProperty({
    description: 'GitHub user email for commits',
    example: 'your_github_email_here'
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  githubEmail: string;
}
