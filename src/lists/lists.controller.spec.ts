import { Test, TestingModule } from '@nestjs/testing';
import { Board } from '../boards/entities/board.entity';
import { User } from '../users/entities/user.entity';
import { CreateListDto } from './dto/create-list.dto';
import { List } from './entities/list.entity';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

const user: User = {
  id: 1,
  username: 'admin',
  password: '1234',
};

const boardEntity = new Board({
  id: 1,
  name: 'Board 1',
  users: [user],
});

const listEntityList: List[] = [
  {
    id: 1,
    name: 'test',
    board: boardEntity,
  },
  {
    id: 2,
    name: 'test 2',
    board: boardEntity,
  },
];

describe('ListsController', () => {
  let listController: ListsController;
  let listService: ListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListsController],
      providers: [
        {
          provide: ListsService,
          useValue: {
            create: jest.fn().mockResolvedValue(listEntityList[0]),
            findAll: jest.fn().mockResolvedValue(listEntityList),
            findOne: jest.fn().mockResolvedValue(listEntityList[0]),
            update: jest.fn().mockResolvedValue(listEntityList[0]),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    listController = module.get<ListsController>(ListsController);
    listService = module.get<ListsService>(ListsService);
  });

  it('should be defined', () => {
    expect(listController).toBeDefined();
    expect(listService).toBeDefined();
  });

  describe('create', () => {
    it('should return a list', async () => {
      // Arrange
      const list: CreateListDto = {
        name: 'test',
        board: boardEntity,
      };

      // Act
      const result = await listController.create(list, user);

      // Assert
      expect(result).toEqual(listEntityList[0]);
    });

    it('should throw an error', async () => {
      // Arrange
      const body: CreateListDto = {
        name: 'Test',
        board: boardEntity,
      };
      jest.spyOn(listService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(listController.create(body, user)).rejects.toThrowError();
    });
  });
});
