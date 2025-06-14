import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { Form } from './entities/form.entity';
import { GetUser } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  async createForm(
    @Body() createFormDto: CreateFormDto,
    @GetUser() user: User,
  ): Promise<Form> {
    return this.formService.createForm(user.id, createFormDto);
  }

  @Get(':id')
  async getFormById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Form> {
    return this.formService.getFormById(id);
  }

  @Get('team/:teamId')
  async getFormsByTeamId(
    @Param('teamId', new ParseUUIDPipe()) teamId: string,
  ): Promise<Form[]> {
    return this.formService.getFormsByTeamId(teamId);
  }
}
