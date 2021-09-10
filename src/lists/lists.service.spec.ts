import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListsService } from './lists.service';
import { BoardsService } from '../boards/boards.service';
import { Repository } from 'typeorm';
import { Board } from '../boards/entities/board.entity';
import { User } from '../users/entities/user.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

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

const boardEntity: Board = new Board({ id: 1, name: 'Board 1', users: [user] });

const listEntityList: List[] = [
  {
    name: 'test',
    board: boardEntity,
    id: 1,
  },
  {
    name: 'test 2',
    board: boardEntity,
    id: 2,
  },
];

const updatedList: List = {
  name: 'test 2',
  id: 1,
  board: boardEntity,
};

describe('ListsService', () => {
  let listService: ListsService;
  let listRepository: Repository<List>;
  let boardService: BoardsService;
  let boardRepository: Repository<Board>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListsService,
        BoardsService,
        {
          provide: getRepositoryToken(Board),
          useValue: {
            save: jest.fn().mockResolvedValue(boardEntity),
            findOneOrFail: jest.fn().mockResolvedValue(boardEntity),
            findOne: jest.fn().mockResolvedValue(boardEntity),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(List),
          useValue: {
            save: jest.fn().mockResolvedValue(listEntityList[0]),
            update: jest.fn().mockResolvedValue(listEntityList[0]),
            findOne: jest.fn().mockResolvedValue(listEntityList[0]),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    listService = module.get<ListsService>(ListsService);
    listRepository = module.get<Repository<List>>(getRepositoryToken(List));
    boardService = module.get<BoardsService>(BoardsService);
    boardRepository = module.get<Repository<Board>>(getRepositoryToken(Board));
  });

  it('should be defined', () => {
    expect(listService).toBeDefined();
    expect(listRepository).toBeDefined();
    expect(boardService).toBeDefined();
    expect(boardRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new list', async () => {
      // Arrange
      const listDto: CreateListDto = {
        name: 'test',
        board: boardEntity,
      };

      // Act
      const result = await listService.create(listDto, user);

      // Assert
      expect(result).toEqual(listEntityList[0]);
    });

    it('should throw an error if the user is not the owner of the board', async () => {
      // Arrange
      const listDto: CreateListDto = {
        name: 'test',
        board: boardEntity,
      };

      // Act
      await expect(listService.create(listDto, user2)).rejects.toThrowError();
    });

    it('should throw an exceptiom', () => {
      // Arrange
      const listDto: CreateListDto = {
        name: 'test',
        board: boardEntity,
      };

      jest.spyOn(listRepository, 'save').mockRejectedValue(new Error());

      // Act
      expect(listService.create(listDto, user)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a list', async () => {
      // Arrange
      const listDto: UpdateListDto = {
        name: 'test 2',
      };
      jest.spyOn(listService, 'findOne').mockResolvedValue(listEntityList[0]);
      jest.spyOn(listRepository, 'findOne').mockResolvedValue(updatedList);

      // Act
      const result = await listService.update(1, listDto, user);

      // Assert
      expect(result).toEqual(updatedList);
    });

    it('should throw an exception', () => {
      // Arrange
      const listDto: UpdateListDto = {
        name: 'test 2',
      };
      jest.spyOn(listService, 'findOne').mockResolvedValue(listEntityList[0]);
      jest.spyOn(listRepository, 'update').mockRejectedValueOnce(new Error());

      // Act
      expect(listService.update(1, listDto, user2)).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should delete a list', async () => {
      // Arrange
      jest.spyOn(listService, 'findOne').mockResolvedValue(listEntityList[0]);
      jest
        .spyOn(listRepository, 'findOne')
        .mockResolvedValue(listEntityList[0]);
      jest.spyOn(listRepository, 'delete').mockResolvedValue(undefined);

      // Act
      const result = await listService.remove(1, user);

      // Assert
      expect(result).toBeUndefined();
      expect(listRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(listService, 'findOne').mockResolvedValue(listEntityList[0]);

      jest.spyOn(listRepository, 'delete').mockRejectedValueOnce(new Error());

      // Assert
      expect(listService.remove(1, user)).rejects.toThrowError();
    });
  });
});
