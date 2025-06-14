import { IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAnswerDto } from './create-answer.dto';

export class CreateResponseDto {
  @IsString()
  formId: string;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  @IsArray()
  answers: CreateAnswerDto[];
}
