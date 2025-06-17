import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { GetUser } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { TaskStatus } from './entities/task.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('teams/:teamId/tasks')
  @ApiOperation({ summary: 'Create a new task in a team' })
  @ApiParam({ name: 'teamId', type: 'string' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  async createTask(
    @Param('teamId', new ParseUUIDPipe()) teamId: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ) {
    return this.taskService.createTask({ ...createTaskDto, teamId }, user.id);
  }

  @Get('teams/:teamId/tasks')
  @ApiOperation({ summary: 'List all tasks in a team' })
  @ApiParam({ name: 'teamId', type: 'string' })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  @ApiQuery({ name: 'assigneeId', type: 'string', required: false })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  async getTasksByTeam(
    @Param('teamId', new ParseUUIDPipe()) teamId: string,
    @Query('status') status?: TaskStatus,
    @Query('assigneeId') assigneeId?: string,
    @Query('search') search?: string,
  ) {
    return this.taskService.getTasksByTeam(teamId, { status, assigneeId, search });
  }

  @Get('tasks/:taskId')
  @ApiOperation({ summary: 'Get task details by ID' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async getTaskById(@Param('taskId', new ParseUUIDPipe()) taskId: string) {
    return this.taskService.getTaskById(taskId);
  }

  @Put('tasks/:taskId')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async updateTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.taskService.updateTask(taskId, updateTaskDto, user.id);
  }

  @Delete('tasks/:taskId')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async deleteTask(@Param('taskId', new ParseUUIDPipe()) taskId: string) {
    return this.taskService.deleteTask(taskId);
  }

  @Post('tasks/:taskId/assign')
  @ApiOperation({ summary: 'Assign a user to a task' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async assignTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body('userId') assigneeId: string,
    @GetUser() user: User,
  ) {
    return this.taskService.assignTask(taskId, assigneeId, user.id);
  }

  @Post('tasks/:taskId/unassign')
  @ApiOperation({ summary: 'Unassign a task' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async unassignTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @GetUser() user: User,
  ) {
    return this.taskService.unassignTask(taskId, user.id);
  }

  @Get('users/:userId/tasks')
  @ApiOperation({ summary: 'Get all tasks assigned to a user' })
  @ApiParam({ name: 'userId', type: 'string' })
  async getTasksByAssignee(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.taskService.getTasksByAssignee(userId);
  }

  @Post('tasks/:taskId/subtasks')
  @ApiOperation({ summary: 'Create a subtask under a parent task' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async createSubtask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body('title') title: string,
    @Body('description') description?: string,
  ) {
    return this.taskService.createSubtask(taskId, title, description);
  }

  @Get('tasks/:taskId/subtasks')
  @ApiOperation({ summary: 'List all subtasks for a task' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async getSubtasks(@Param('taskId', new ParseUUIDPipe()) taskId: string) {
    return this.taskService.getSubtasks(taskId);
  }

  @Put('subtasks/:subtaskId')
  @ApiOperation({ summary: 'Update a subtask' })
  @ApiParam({ name: 'subtaskId', type: 'string' })
  async updateSubtask(
    @Param('subtaskId', new ParseUUIDPipe()) subtaskId: string,
    @Body('title') title: string,
    @Body('description') description?: string,
  ) {
    return this.taskService.updateSubtask(subtaskId, title, description);
  }

  @Delete('subtasks/:subtaskId')
  @ApiOperation({ summary: 'Delete a subtask' })
  @ApiParam({ name: 'subtaskId', type: 'string' })
  async deleteSubtask(@Param('subtaskId', new ParseUUIDPipe()) subtaskId: string) {
    return this.taskService.deleteSubtask(subtaskId);
  }

  @Post('tasks/:taskId/related')
  @ApiOperation({ summary: 'Relate another task' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async addRelatedTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body('relatedTaskId') relatedTaskId: string,
  ) {
    return this.taskService.addRelatedTask(taskId, relatedTaskId);
  }

  @Delete('tasks/:taskId/related/:relatedTaskId')
  @ApiOperation({ summary: 'Remove a related task' })
  @ApiParam({ name: 'taskId', type: 'string' })
  @ApiParam({ name: 'relatedTaskId', type: 'string' })
  async removeRelatedTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Param('relatedTaskId', new ParseUUIDPipe()) relatedTaskId: string,
  ) {
    return this.taskService.removeRelatedTask(taskId, relatedTaskId);
  }

  @Get('tasks/:taskId/related')
  @ApiOperation({ summary: 'List related tasks' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async getRelatedTasks(@Param('taskId', new ParseUUIDPipe()) taskId: string) {
    return this.taskService.getRelatedTasks(taskId);
  }

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async addComment(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body('content') content: string,
    @GetUser() user: User,
  ) {
    return this.taskService.addComment(taskId, content, user.id);
  }

  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'List comments for a task' })
  @ApiParam({ name: 'taskId', type: 'string' })
  async getComments(@Param('taskId', new ParseUUIDPipe()) taskId: string) {
    return this.taskService.getComments(taskId);
  }
} 