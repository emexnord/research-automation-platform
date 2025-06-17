import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Subtask } from './entities/subtask.entity';
import { Comment } from './entities/comment.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Subtask)
    private subtaskRepository: Repository<Subtask>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      taskId: `${createTaskDto.teamId.substring(0, 2).toUpperCase()}-${String(Date.now()).slice(-3)}`,
      activity: [{
        id: `act-${Date.now()}`,
        type: 'created',
        description: 'Task created',
        userId,
        createdAt: new Date(),
      }],
    });

    if (createTaskDto.assigneeId) {
      task.assignmentHistory = [{
        assigneeId: createTaskDto.assigneeId,
        assignedBy: userId,
        assignedAt: new Date(),
        action: 'assigned',
      }];
    }

    return await this.taskRepository.save(task);
  }

  async getTasksByTeam(teamId: string, filters?: {
    status?: TaskStatus;
    assigneeId?: string;
    search?: string;
  }): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task')
      .where('task.teamId = :teamId', { teamId });

    if (filters?.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters?.assigneeId) {
      query.andWhere('task.assigneeId = :assigneeId', { assigneeId: filters.assigneeId });
    }

    if (filters?.search) {
      query.andWhere('(task.title ILIKE :search OR task.description ILIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    return await query.getMany();
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'relatedTasks'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.getTaskById(id);

    const activityEntry = {
      id: `act-${Date.now()}`,
      type: 'updated' as const,
      description: 'Task updated',
      userId,
      createdAt: new Date(),
    };

    if (updateTaskDto.assigneeId !== undefined && updateTaskDto.assigneeId !== task.assigneeId) {
      const action = !updateTaskDto.assigneeId ? 'unassigned' : 
                    !task.assigneeId ? 'assigned' : 'reassigned';
      
      task.assignmentHistory.push({
        assigneeId: updateTaskDto.assigneeId,
        assignedBy: userId,
        assignedAt: new Date(),
        action,
      });

      activityEntry.description = `Task ${action}`;
    }

    Object.assign(task, updateTaskDto);
    task.activity.push(activityEntry);

    return await this.taskRepository.save(task);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async assignTask(taskId: string, assigneeId: string, userId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);
    
    const action = !task.assigneeId ? 'assigned' : 'reassigned';
    
    task.assigneeId = assigneeId;
    task.assignmentHistory.push({
      assigneeId,
      assignedBy: userId,
      assignedAt: new Date(),
      action,
    });

    task.activity.push({
      id: `act-${Date.now()}`,
      type: 'assigned',
      description: `Task ${action}`,
      userId,
      createdAt: new Date(),
    });

    return await this.taskRepository.save(task);
  }

  async unassignTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);
    
    task.assigneeId = null;
    task.assignmentHistory.push({
      assigneeId: null,
      assignedBy: userId,
      assignedAt: new Date(),
      action: 'unassigned',
    });

    task.activity.push({
      id: `act-${Date.now()}`,
      type: 'assigned',
      description: 'Task unassigned',
      userId,
      createdAt: new Date(),
    });

    return await this.taskRepository.save(task);
  }

  async getTasksByAssignee(userId: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { assigneeId: userId },
      relations: ['team'],
    });
  }

  async createSubtask(taskId: string, title: string, description?: string): Promise<Subtask> {
    const task = await this.getTaskById(taskId);
    
    const subtask = this.subtaskRepository.create({
      title,
      description,
      parentTaskId: taskId,
    });

    return await this.subtaskRepository.save(subtask);
  }

  async getSubtasks(taskId: string): Promise<Subtask[]> {
    return await this.subtaskRepository.find({
      where: { parentTaskId: taskId },
      relations: ['assignee'],
    });
  }

  async updateSubtask(id: string, title: string, description?: string): Promise<Subtask> {
    const subtask = await this.subtaskRepository.findOne({ where: { id } });
    if (!subtask) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }

    subtask.title = title;
    if (description !== undefined) {
      subtask.description = description;
    }

    return await this.subtaskRepository.save(subtask);
  }

  async deleteSubtask(id: string): Promise<void> {
    const result = await this.subtaskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }
  }

  async addRelatedTask(taskId: string, relatedTaskId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);
    const relatedTask = await this.getTaskById(relatedTaskId);

    if (!task.relatedTasks) {
      task.relatedTasks = [];
    }

    if (task.relatedTasks.some(t => t.id === relatedTaskId)) {
      throw new BadRequestException('Tasks are already related');
    }

    task.relatedTasks.push(relatedTask);
    return await this.taskRepository.save(task);
  }

  async removeRelatedTask(taskId: string, relatedTaskId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);
    
    if (!task.relatedTasks) {
      throw new BadRequestException('No related tasks found');
    }

    task.relatedTasks = task.relatedTasks.filter(t => t.id !== relatedTaskId);
    return await this.taskRepository.save(task);
  }

  async getRelatedTasks(taskId: string): Promise<Task[]> {
    const task = await this.getTaskById(taskId);
    return task.relatedTasks || [];
  }

  async addComment(taskId: string, content: string, authorId: string): Promise<Comment> {
    const task = await this.getTaskById(taskId);
    
    const comment = this.commentRepository.create({
      content,
      taskId,
      authorId,
    });

    return await this.commentRepository.save(comment);
  }

  async getComments(taskId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { taskId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
} 