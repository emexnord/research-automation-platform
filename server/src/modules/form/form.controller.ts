import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { Form } from './entities/form.entity';
import { GetUser } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { GenerateAIFormDto } from './dto/generate-form.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
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

  @Post('ai')
  async generateFormFromAI(
    @GetUser() user: User,
    @Body() generateAIFormDto: GenerateAIFormDto,
  ): Promise<Form> {
    const { teamId, context, numberOfQuestions } = generateAIFormDto;
    return this.formService.generateFormFromAI(
      user.id,
      teamId,
      context,
      numberOfQuestions,
    );
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
