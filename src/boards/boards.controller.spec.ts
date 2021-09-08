import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
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

const boardEntity = new Board({
  id: 1,
  name: 'Board 1',
  users: [user],
});

const updatedBoardEntity = new Board({
  id: 1,
  name: 'Board 2',
  users: [user],
});

describe('BoardsController', () => {
  let boardController: BoardsController;
  let boardService: BoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        {
          provide: BoardsService,
          useValue: {
            create: jest.fn().mockResolvedValue(boardEntity),
            findAll: jest.fn().mockResolvedValue(boardEntityList),
            findOne: jest.fn().mockResolvedValue(boardEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedBoardEntity),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    boardController = module.get<BoardsController>(BoardsController);
    boardService = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(boardController).toBeDefined();
    expect(boardService).toBeDefined();
  });
  describe('findAll', () => {
    it('should return a board list entity', async () => {
      // Act
      const result = await boardController.findAll(user);

      // Assert
      expect(result).toEqual(boardEntityList);
    });

    it('should throw an exception', () => {
      jest.spyOn(boardService, 'findAll').mockRejectedValueOnce(new Error());

      expect(boardController.findAll(user)).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a new Board Entity', async () => {
      // Arrange
      const body: CreateBoardDto = {
        name: 'Board 1',
        users: [user],
      };

      // Act
      const result = await boardController.create(body, user);

      //Assert
      expect(result).toEqual(boardEntity);
      expect(boardService.create).toHaveBeenCalledWith(body, user);
    });

    it('should throw an exception', () => {
      // Arrange
      const body: CreateBoardDto = {
        name: 'Board 1',
        users: [user],
      };
      jest.spyOn(boardService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(boardController.create(body, user)).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should get a board entity by id', async () => {
      // Act
      const result = await boardController.findOne('1', user);

      // Assert
      expect(result).toEqual(boardEntityList[0]);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(boardService, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(boardController.findOne('id', user)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a board item', async () => {
      // Arrange
      const body: UpdateBoardDto = {
        name: 'Board 2',
      };

      // Act
      const result = await boardController.update('1', body, user);

      // Assert
      expect(result).toEqual(updatedBoardEntity);
      expect(boardService.update).toHaveBeenCalledTimes(1);
      expect(boardService.update).toHaveBeenCalledWith(1, body, user);
    });

    it('should throw an exception', () => {
      // Arrange
      const body: UpdateBoardDto = {
        name: 'Board 2',
      };

      jest.spyOn(boardService, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(boardController.update('1', body, user)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should remove a board item', async () => {
      // Act
      const result = await boardController.remove('1', user);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(boardService, 'remove').mockResolvedValueOnce(new Error());

      // Assert
      expect(boardController.remove('1', user)).rejects.toThrowError();
    });
  });
});
