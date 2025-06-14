import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from './create-question.dto';

export class CreateFormDto {
  @IsString()
  title: string;

  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];

  @IsString()
  teamId: string;
}
