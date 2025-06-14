import { IsString, IsInt, Min } from 'class-validator';

export class GenerateAIFormDto {
  @IsString()
  context: string;

  @IsInt()
  @Min(1)
  numberOfQuestions: number;

  @IsString()
  teamId: string;
}
