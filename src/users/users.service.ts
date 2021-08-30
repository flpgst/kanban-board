import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { adminUser } from './constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const users = await this.userRepository.find();
    if (!users.length) this.userRepository.save(adminUser);
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({ username });
  }

  async update(id: number, updateTaskDto: UpdateUserDto) {
    await this.userRepository.findOneOrFail(id);
    await this.userRepository.update(id, updateTaskDto);
    return this.userRepository.findOne(id);
  }

  async remove(id: number) {
    await this.userRepository.findOneOrFail(id);
    await this.userRepository.delete(id);
    return;
  }
}
