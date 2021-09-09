import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './entities/list.entity';
import { BoardsService } from '../boards/boards.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    private readonly boardService: BoardsService,
  ) {}

  async create(createListDto: CreateListDto, user: User) {
    const board = await this.boardService.findOne(createListDto.board.id, user);
    if (board instanceof Error) throw new UnauthorizedException();
    return await this.listRepository.save(createListDto);
  }

  async findAll(user: User) {
    const lists = await getConnection()
      .createQueryBuilder()
      .select('list')
      .from(List, 'list')
      .leftJoinAndSelect('list.board', 'board')
      .leftJoinAndSelect('board.users', 'users')
      .where('users.id = :id', { id: user.id })
      .getMany();
    return lists;
  }

  async findOne(id: number, user: User) {
    try {
      const list = await getConnection()
        .createQueryBuilder()
        .select('list')
        .from(List, 'list')
        .leftJoinAndSelect('list.board', 'board')
        .leftJoinAndSelect('board.users', 'users')
        .andWhere('users.id = :id', { id: user.id })
        .andWhere('list.id = :id', { id })
        .getOneOrFail();
      return list;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async update(id: number, updateListDto: UpdateListDto, user: User) {
    const list = await this.findOne(id, user);
    if (list instanceof Error) throw new UnauthorizedException();
    await this.listRepository.update(id, updateListDto);
    return await this.listRepository.findOne(id);
  }

  async remove(id: number, user: User) {
    const list = await this.findOne(id, user);
    if (list instanceof Error) throw new UnauthorizedException();
    await this.listRepository.delete(id);
    return;
  }
}
