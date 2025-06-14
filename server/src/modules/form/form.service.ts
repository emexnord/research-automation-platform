import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './entities/form.entity';
import { Question } from './entities/question.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { GeneratedQuestion } from './entities/question.type';
import { GeminiService } from './ai.service';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private geminiService: GeminiService,
  ) {}

  async createForm(owner: string, createFormDto: CreateFormDto): Promise<Form> {
    const form = this.formRepository.create({
      owner,
      title: createFormDto.title,
      teamId: createFormDto.teamId,
      questions: createFormDto.questions.map((q) =>
        this.questionRepository.create({
          content: q.content,
          type: q.type,
          options: q.options,
          isRequired: q.isRequired,
        }),
      ),
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

  async generateFormFromAI(
    userId: string,
    teamId: string,
    context: string,
    numberOfQuestions: number,
  ): Promise<Form> {
    const questionsJson: GeneratedQuestion[] =
      await this.geminiService.generateQuestions(context, numberOfQuestions);

    const form = this.formRepository.create({
      owner: userId,
      title: `AI Generated Form - ${context}`,
      context,
      teamId,
      questions: questionsJson.map((q) =>
        this.questionRepository.create({
          content: q.question,
          type: q.type,
          options: q.options,
          isRequired: q.required,
        }),
      ),
    });

    return await this.formRepository.save(form);
  }
}
