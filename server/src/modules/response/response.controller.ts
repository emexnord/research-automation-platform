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
}
