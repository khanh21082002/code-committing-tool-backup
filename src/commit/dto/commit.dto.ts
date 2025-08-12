import { IsString, IsNotEmpty, IsUrl, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommitDto {
  @ApiProperty({ description: 'URL of the target Git repository' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  repoUrl: string;

  @ApiProperty({ description: 'Branch of the target Git repository' })
  @IsString()
  @IsNotEmpty()
  repoBranch: string;

  @ApiProperty({ description: 'GitHub Personal Access Token' })
  @IsString()
  @IsNotEmpty()
  githubToken: string;

  @ApiProperty({ description: 'GitHub user name for commits' })
  @IsString()
  @IsNotEmpty()
  githubName: string;

  @ApiProperty({ description: 'GitHub user email for commits' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  githubEmail: string;
}
