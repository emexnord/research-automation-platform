import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { User } from '../user/entities/user.entity';
import { In } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getTeamMembers(teamId: string): Promise<User[]> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return await this.userRepository.find({
      where: { id: In(team.members) },
      select: ['id', 'name', 'email', 'role']
    });
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    return await this.teamRepository.findOne({ where: { id: teamId } });
  }
  async createTeam(
    name: string,
    createdBy: string,
    description?: string,
  ): Promise<Team> {
    const team = this.teamRepository.create({
      name,
      description,
      created_by: createdBy,
      members: [createdBy],
    });
    return await this.teamRepository.save(team);
  }

  async addUserToTeam(teamId: string, userId: string): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await this.teamRepository.save(team);
    }

    return team;
  }

  async updateTeam(
    teamId: string,
    name?: string,
    description?: string,
  ): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (name !== undefined) {
      team.name = name;
    }

    if (description !== undefined) {
      team.description = description;
    }

    return await this.teamRepository.save(team);
  }
}
