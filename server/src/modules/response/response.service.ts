import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from './entities/response.entity';
import { Answer } from './entities/answer.entity';
import { CreateResponseDto } from './dto/create-response.dto';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,

    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  async createResponse(dto: CreateResponseDto): Promise<Response> {
    const { formId, userEmail, answers } = dto;

    const response = this.responseRepository.create({
      formId,
      userEmail,
      answers,
    });

    return await this.responseRepository.save(response);
  }

  async getResponseById(id: string): Promise<Response> {
    const response = await this.responseRepository.findOne({
      where: { id },
      relations: ['answers'],
    });

    if (!response) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }

    return response;
  }

  async getResponsesByFormId(formId: string): Promise<Response[]> {
    const responses = await this.responseRepository.find({
      where: { formId },
      relations: ['answers'],
      order: { createdAt: 'DESC' },
    });

    return responses;
  }
}
