import { Controller, Post, Put, Param, Body, UseGuards, Get } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { GetUser } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddUserToTeamDto } from './dto/add-user-to-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@ApiTags('Team')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({ status: 200, description: 'List of teams' })
  async getAllTeams(@GetUser() user: User) {
    return this.teamService.getAllTeams(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['name'],
    },
  })
  @ApiResponse({ status: 201, description: 'Team successfully created' })
  async createTeam(@Body() dto: CreateTeamDto, @GetUser() user: User) {
    return this.teamService.createTeam(dto.name, user.id, dto.description);
  }

  @Put(':id/add-user')
  @ApiOperation({ summary: 'Add a user to a team' })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
      },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 200, description: 'User added to team' })
  async addUserToTeam(
    @Param('id') teamId: string,
    @Body() body: AddUserToTeamDto,
    @GetUser() user: User,
  ) {
    // Optionally validate user is allowed to add others (e.g., created_by)
    return this.teamService.addUserToTeam(teamId, body.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update team name and/or description' })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Team updated successfully' })
  async updateTeam(
    @Param('id') teamId: string,
    @Body() body: UpdateTeamDto,
    @GetUser() user: User,
  ) {
    // Optionally validate user is the team owner (created_by)
    return this.teamService.updateTeam(teamId, body.name, body.description);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get all members of a team' })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiResponse({
    status: 200,
    description: 'Team members returned',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          avatar: { type: 'string', nullable: true },
          initials: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'member', 'viewer'] }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async getTeamMembers(@Param('id') teamId: string) {
    return this.teamService.getTeamMembers(teamId);
  }
}
