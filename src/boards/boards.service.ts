import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const board = {
      ...createBoardDto,
      users: [user],
    };

    return await this.boardRepository.save(board);
  }

  async findAll(user: User): Promise<Board[]> {
    const boards = await createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.users', 'users')
      .where('users.id = :id', { id: user.id })
      .getMany();
    return boards;
  }

  async findOne(id: number, user: User): Promise<Board> {
    try {
      const board = await this.boardRepository.findOneOrFail(id, {
        relations: ['users'],
      });
      const hasAccess = board.users.find(({ id }) => id === user.id);
      if (!hasAccess) throw new UnauthorizedException();
      return board;
    } catch (error) {
      return error;
    }
  }

  async update(
    id: number,
    updateBoardDto: UpdateBoardDto,
    user: User,
  ): Promise<Board> {
    const board = await this.boardRepository.findOneOrFail(id, {
      relations: ['users'],
    });
    const hasAccess = board.users.find(({ id }) => id === user.id);
    if (!hasAccess) throw new UnauthorizedException();
    await this.boardRepository.save({ id, ...updateBoardDto });
    return this.boardRepository.findOne(id);
  }

  async remove(id: number, user: User): Promise<void> {
    try {
      const board = await this.boardRepository.findOneOrFail(id, {
        relations: ['users'],
      });
      const hasAccess = board.users.find(({ id }) => id === user.id);
      if (!hasAccess) throw new UnauthorizedException();
      await this.boardRepository.delete(id);
      return;
    } catch (error) {
      throw error;
    }
  }
}
