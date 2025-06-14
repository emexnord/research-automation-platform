import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './entities/form.entity';
import { Question } from './entities/question.entity';
import { CreateFormDto } from './dto/create-form.dto';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async createForm(owner: string, createFormDto: CreateFormDto): Promise<Form> {
    const form = this.formRepository.create({
      owner,
      title: createFormDto.title,
      questions: createFormDto.questions,
    });

    return await this.formRepository.save(form);
  }

  async getFormById(id: string): Promise<Form> {
    const form = await this.formRepository.findOne({
      where: { id },
      relations: ['questions'],
    });

    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }

    return form;
  }

  async getFormsByTeamId(teamId: string): Promise<Form[]> {
    return await this.formRepository.find({
      where: { teamId },
    });
  }
}
