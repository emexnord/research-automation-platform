import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { Response as FormResponse } from './entities/response.entity';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  async create(@Body() dto: CreateResponseDto): Promise<FormResponse> {
    return this.responseService.createResponse(dto);
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<FormResponse> {
    return this.responseService.getResponseById(id);
  }

  @Get('form/:formId')
  async getByFormId(
    @Param('formId', new ParseUUIDPipe()) formId: string,
  ): Promise<FormResponse[]> {
    return this.responseService.getResponsesByFormId(formId);
  }

  @Get('form/:formId/total-responses')
  @ApiOperation({ summary: 'Get total number of responses for a form' })
  @ApiParam({ name: 'formId', description: 'Form UUID' })
  async getTotalResponses(@Param('formId') formId: string) {
    return this.responseService.getTotalResponsesForForm(formId);
  }

  @Get('form/:formId/grouped-answers')
  @ApiOperation({ summary: 'Group answers by question ID for a form' })
  @ApiParam({ name: 'formId', description: 'Form UUID' })
  async getGroupedAnswers(@Param('formId') formId: string) {
    return this.responseService.getGroupedAnswersByQuestion(formId);
  }

  @Get('question/:questionId/percentages')
  @ApiOperation({
    summary: 'Get percentage breakdown of answers for a question',
  })
  @ApiParam({ name: 'questionId', description: 'Question UUID' })
  async getAnswerPercentages(@Param('questionId') questionId: string) {
    return this.responseService.getAnswerPercentages(questionId);
  }

  @Get('question/:questionId/most-common')
  @ApiOperation({ summary: 'Get most common answer for a question' })
  @ApiParam({ name: 'questionId', description: 'Question UUID' })
  async getMostCommonAnswer(@Param('questionId') questionId: string) {
    return this.responseService.getMostCommonAnswer(questionId);
  }

  @Get('form/:formId/average-answers')
  @ApiOperation({
    summary: 'Get average number of answers per response for a form',
  })
  @ApiParam({ name: 'formId', description: 'Form UUID' })
  async getAverageAnswers(@Param('formId') formId: string) {
    return this.responseService.getAverageAnswersPerResponse(formId);
  }
}
