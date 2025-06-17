import { IsString, IsOptional, IsEnum, IsArray, IsDate, IsNumber, Min } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

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
  @IsOptional()
  dueDate?: Date;

  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedHours?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  actualHours?: number;
} 