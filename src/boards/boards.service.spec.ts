import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';

const user: User = {
  id: 1,
  username: 'admin',
  password: '1234',
};

const boardEntityList: Board[] = [
  new Board({ id: 1, name: 'Board 1', users: [user] }),
  new Board({ id: 2, name: 'Board 2', users: [user] }),
  new Board({ id: 3, name: 'Board 3', users: [user] }),
];

describe('BoardsService', () => {
  let boardService: BoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        {
          provide: getRepositoryToken(Board),
          useValue: {
            findAll: jest.fn(),
            save: jest.fn(),
            findOneOrFail: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockReturnThis(),
            })),
          },
        },
      ],
    }).compile();

    boardService = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(boardService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a board list entity', async () => {
      // Arrange
      const mockRepository = jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          from: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockReturnValueOnce(boardEntityList),
        })),
      }));

      // Assert
      expect(mockRepository().createQueryBuilder().getMany()).toBe(
        boardEntityList,
      );
    });
  });
});
