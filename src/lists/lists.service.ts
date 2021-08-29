import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}

  async create(createListDto: CreateListDto) {
    return await this.listRepository.save(createListDto);
  }

  async findAll() {
    return await this.listRepository.find();
  }

  async findOne(id: number) {
    return await this.listRepository.findOneOrFail(id);
  }

  async update(id: number, updateListDto: UpdateListDto) {
    await this.listRepository.findOneOrFail(id);
    await this.listRepository.update(id, updateListDto);
    return this.listRepository.findOne(id);
  }

  async remove(id: number) {
    await this.listRepository.findOneOrFail(id);
    await this.listRepository.delete(id);
    return;
  }
}
