import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll() {
    return await this.taskRepository.find();
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
