import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

const user: User = {
  id: 1,
  username: 'admin',
  password: '1234',
};

const user2: User = {
  id: 2,
  username: 'filipe',
  password: '1234',
};

const boardEntityList: Board[] = [
  new Board({ id: 1, name: 'Board 1', users: [user] }),
  new Board({ id: 2, name: 'Board 2', users: [user] }),
  new Board({ id: 3, name: 'Board 3', users: [user] }),
];

describe('BoardsService', () => {
  let boardService: BoardsService;
  let boardRepository: Repository<Board>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        {
          provide: getRepositoryToken(Board),
          useValue: {
            save: jest.fn().mockResolvedValue(boardEntityList[0]),
            findOneOrFail: jest.fn().mockResolvedValue(boardEntityList[0]),
            findOne: jest.fn().mockResolvedValue(boardEntityList[0]),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    boardService = module.get<BoardsService>(BoardsService);
    boardRepository = module.get<Repository<Board>>(getRepositoryToken(Board));
  });

  it('should be defined', () => {
    expect(boardService).toBeDefined();
    expect(boardRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a board list entity', async () => {
      // Arrange
      jest.spyOn(boardService, 'findAll').mockResolvedValue(boardEntityList);

      // Assert
      expect(await boardService.findAll(user)).toEqual(boardEntityList);
    });
  });

  describe('findOne', () => {
    it('should return a board entity', async () => {
      // Act
      const result = await boardService.findOne(1, user);

      // Assert
      expect(result).toEqual(boardEntityList[0]);
      expect(boardRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the board does not exist', () => {
      // Arrange
      jest
        .spyOn(boardRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(boardService.findOne(1, user)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a board entity', async () => {
      // Arrange
      const board: CreateBoardDto = { name: 'Board 1', users: [user] };

      // Act
      const result = await boardService.create(board, user);

      // Assert
      expect(result).toEqual(boardEntityList[0]);
      expect(boardRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      const board: CreateBoardDto = { name: 'Board 1', users: [user] };
      jest.spyOn(boardRepository, 'save').mockRejectedValueOnce(new Error());

      // Assert
      expect(boardService.create(board, user)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a board entity', async () => {
      // Arrange
      const board: UpdateBoardDto = { id: 1, name: 'Board 1', users: [user] };

      // Act
      const result = await boardService.update(board.id, board, user);

      // Assert
      expect(result).toEqual(boardEntityList[0]);
      expect(boardRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      const board: UpdateBoardDto = { id: 1, name: 'Board 1', users: [user] };
      jest.spyOn(boardRepository, 'save').mockRejectedValueOnce(new Error());

      // Assert
      expect(boardService.update(board.id, board, user)).rejects.toThrowError();
    });

    it('should throw an exception if the board does not exist', () => {
      // Arrange
      const board: UpdateBoardDto = { id: 1, name: 'Board 1', users: [user] };
      jest
        .spyOn(boardRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(boardService.update(board.id, board, user)).rejects.toThrowError(
        NotFoundException,
      );
    });
    it('should throw an exception if the user is not the owner of the board', () => {
      // Arrange
      const board: UpdateBoardDto = { id: 1, name: 'Board 1', users: [user] };

      // Assert;
      expect(boardService.update(board.id, board, user2)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a board entity', async () => {
      // Act
      const result = await boardService.remove(1, user);

      // Assert
      expect(result).toBeUndefined();
      expect(boardRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception if the board does not exist', () => {
      // Arrange
      jest.spyOn(boardRepository, 'delete').mockRejectedValueOnce(new Error());

      // Assert
      expect(boardService.remove(1, user)).rejects.toThrowError();
    });
  });
});
