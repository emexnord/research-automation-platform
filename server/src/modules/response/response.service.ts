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

  // analytic methods

  async getTotalResponsesForForm(formId: string): Promise<number> {
    return this.responseRepository.count({ where: { formId } });
  }

  async getAnswerPercentages(
    questionId: string,
  ): Promise<Record<string, number>> {
    const answers = await this.answerRepository.find({
      where: { questionId },
    });

    const total = answers.length;
    const countMap: Record<string, number> = {};

    for (const ans of answers) {
      countMap[ans.content] = (countMap[ans.content] || 0) + 1;
    }

    const percentageMap: Record<string, number> = {};
    for (const option in countMap) {
      percentageMap[option] = +((countMap[option] / total) * 100).toFixed(2);
    }

    return percentageMap;
  }

  async getGroupedAnswersByQuestion(
    formId: string,
  ): Promise<Record<string, string[]>> {
    const responses = await this.responseRepository.find({
      where: { formId },
      relations: ['answers'],
    });

    const grouped: Record<string, string[]> = {};

    responses.forEach((response) => {
      response.answers.forEach((answer) => {
        if (!grouped[answer.questionId]) {
          grouped[answer.questionId] = [];
        }
        grouped[answer.questionId].push(answer.content);
      });
    });

    return grouped;
  }

  async getMostCommonAnswer(
    questionId: string,
  ): Promise<{ answer: string; count: number }> {
    const answers = await this.answerRepository.find({ where: { questionId } });

    const countMap: Record<string, number> = {};
    for (const a of answers) {
      countMap[a.content] = (countMap[a.content] || 0) + 1;
    }

    const mostCommon = Object.entries(countMap).sort((a, b) => b[1] - a[1])[0];
    return { answer: mostCommon[0], count: mostCommon[1] };
  }

  async getAverageAnswersPerResponse(formId: string): Promise<number> {
    const responses = await this.responseRepository.find({
      where: { formId },
      relations: ['answers'],
    });

    const totalAnswers = responses.reduce(
      (sum, res) => sum + res.answers.length,
      0,
    );
    return +(totalAnswers / responses.length).toFixed(2);
  }
}
