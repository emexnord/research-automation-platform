import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase();
    return this.userRepository.findOne({
      where: { email: ILike(normalizedEmail) },
    });
  }

  async findOne(filter: Partial<User>): Promise<User | null> {
    return this.userRepository.findOne({ where: filter });
  }

  async findOneWithSensitiveFields(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect(['user.password', 'user.salt'])
      .where({ email })
      .getOne();
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async updateById(id: string, update: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, update);
    return this.findById(id);
  }

  async updateByEmail(
    email: string,
    update: Partial<User>,
  ): Promise<User | null> {
    await this.userRepository.update(
      { email: ILike(email.toLowerCase()) },
      update,
    );
    return this.findByEmail(email);
  }

  async deleteById(id: string): Promise<User | null> {
    const user = await this.findById(id);
    if (user) {
      await this.userRepository.delete(id);
    }
    return user;
  }

  async findWithPagination(
    filter: Partial<User>,
    skip: number,
    limit: number,
  ): Promise<User[]> {
    return this.userRepository.find({
      where: filter,
      skip,
      take: limit,
    });
  }

  async countDocuments(filter: Partial<User>): Promise<number> {
    return this.userRepository.count({ where: filter });
  }
}
