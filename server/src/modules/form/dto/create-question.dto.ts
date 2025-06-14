import { IsBoolean, IsOptional, IsString, IsArray } from 'class-validator';
import { QuestionType } from '../entities/question.type';

export class CreateQuestionDto {
  @IsString()
  content: string;

  @IsString()
  type: QuestionType;

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsBoolean()
  isRequired: boolean;
}
