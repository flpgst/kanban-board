import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { getConnection, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    return await this.taskRepository.save(createTaskDto);
  }

  async findAll(user: User) {
    const tasks = await getConnection()
      .createQueryBuilder()
      .select('task')
      .from(Task, 'task')
      .leftJoinAndSelect('task.list', 'list')
      .leftJoinAndSelect('list.board', 'board')
      .leftJoinAndSelect('board.users', 'users')
      .where('users.id = :id', { id: user.id })
      .getMany();
    return tasks;
  }

  async findOne(id: number, user: User) {
    try {
      const task = await getConnection()
        .createQueryBuilder()
        .select('task')
        .from(Task, 'task')
        .leftJoinAndSelect('task.list', 'list')
        .leftJoinAndSelect('list.board', 'board')
        .leftJoinAndSelect('board.users', 'users')
        .andWhere('task.id = :id', { id })
        .andWhere('users.id = :id', { id: user.id })
        .getOneOrFail();

      return task;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.findOne(id, user);
    if (task instanceof Error) throw new UnauthorizedException();
    await this.taskRepository.update(id, updateTaskDto);
    return await this.taskRepository.findOne(id);
  }

  async remove(id: number, user: User) {
    const task = await this.findOne(id, user);
    if (task instanceof Error) throw new UnauthorizedException();
    await this.taskRepository.delete(id);
    return;
  }
}
