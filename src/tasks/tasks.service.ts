import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
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

  async findOne(id: number) {
    return await this.taskRepository.findOneOrFail(id);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.taskRepository.findOneOrFail(id);
    await this.taskRepository.update(id, updateTaskDto);
    return this.taskRepository.findOne(id);
  }

  async remove(id: number) {
    await this.taskRepository.findOneOrFail(id);
    await this.taskRepository.delete(id);
    return;
  }
}
