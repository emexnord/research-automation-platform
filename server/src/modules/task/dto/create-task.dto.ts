import { IsString, IsOptional, IsEnum, IsArray, IsDate, IsNumber, Min } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  teamId: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  assigneeId?: string;

  @IsArray()
  @IsOptional()
  labels?: Array<{
    name: string;
    color: string;
    textColor: string;
  }>;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date = new Date(); 

  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedHours?: number;
} 