import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    return await this.boardRepository.save(createBoardDto);
  }

  async findAll() {
    return await this.boardRepository.find();
  }

  async findOne(id: number) {
    return await this.boardRepository.findOneOrFail(id);
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    await this.boardRepository.findOneOrFail(id);
    await this.boardRepository.update(id, updateBoardDto);
    return this.boardRepository.findOne(id);
  }

  async remove(id: number) {
    await this.boardRepository.findOneOrFail(id);
    await this.boardRepository.delete(id);
    return;
  }
}
