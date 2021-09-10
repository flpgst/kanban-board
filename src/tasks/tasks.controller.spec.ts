import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
import { Board } from '../boards/entities/board.entity';
import { List } from '../lists/entities/list.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

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

const listEntity: List = {
  id: 1,
  name: 'test',
  board: boardEntity,
};

const taskEntityList: Task[] = [
  {
    id: 1,
    title: 'Task-1',
    description: 'First testing task',
    scrumPonctuation: 1,
    status: TaskStatus.TO_DO,
    archived: false,
    list: listEntity,
  },
  {
    id: 2,
    title: 'Task-2',
    description: 'Second testing task',
    scrumPonctuation: 5,
    status: TaskStatus.DOING,
    archived: false,
    list: listEntity,
  },
];

const updatedTask: Task = {
  id: 1,
  title: 'Task-1',
  description: 'First testing task',
  scrumPonctuation: 1,
  status: TaskStatus.DONE,
  archived: false,
  list: listEntity,
};

describe('TasksController', () => {
  let taskController: TasksController;
  let taskService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn().mockResolvedValue(taskEntityList[0]),
            findAll: jest.fn().mockResolvedValue(taskEntityList),
            findOne: jest.fn().mockResolvedValue(taskEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedTask),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    taskController = module.get<TasksController>(TasksController);
    taskService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
    expect(taskService).toBeDefined();
  });

  describe('create', () => {
    it('should return a task', async () => {
      // Arrange
      const taskDto: CreateTaskDto = {
        title: 'Task-1',
        description: 'First testing task',
        scrumPonctuation: 1,
        status: TaskStatus.TO_DO,
        archived: false,
        list: listEntity,
      };

      // Act
      const result = await taskController.create(taskDto);

      // Assert
      expect(result).toEqual(taskEntityList[0]);
    });

    it('should throw an exception', () => {
      // Arrange
      const taskDto: CreateTaskDto = {
        title: 'Task-1',
        description: 'First testing task',
        scrumPonctuation: 1,
        status: TaskStatus.TO_DO,
        archived: false,
        list: listEntity,
      };
      jest.spyOn(taskController, 'create').mockRejectedValueOnce(new Error());

      // Act
      expect(taskController.create).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('should return a taks list', async () => {
      // Act
      const result = await taskController.findAll(user);

      // Assert
      expect(result).toEqual(taskEntityList);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(taskController, 'findAll').mockRejectedValueOnce(new Error());

      // Assert
      expect(taskController.findAll(user)).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return an task entity', async () => {
      // Act
      const result = await taskController.findOne('1', user);

      // Assert
      expect(result).toEqual(taskEntityList[0]);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(taskController, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(taskController.findOne).rejects.toThrowError();
    });
  });
  describe('update', () => {
    it('should update a task entity', async () => {
      // Arrange
      const taskDto: UpdateTaskDto = {
        title: 'Task-1',
        description: 'First testing task',
        scrumPonctuation: 1,
        status: TaskStatus.DONE,
        archived: false,
        list: listEntity,
      };

      // Act
      const result = await taskController.update('1', taskDto, user);

      // Assert
      expect(result).toEqual(updatedTask);
    });

    it('should throw an exception', () => {
      // Arrange
      const taskDto: UpdateTaskDto = {
        title: 'Task-1',
        description: 'First testing task',
        scrumPonctuation: 1,
        status: TaskStatus.DONE,
        archived: false,
        list: listEntity,
      };
      jest.spyOn(taskController, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(taskController.update('1', taskDto, user)).rejects.toThrowError();
    });
  });
  describe('delete', () => {
    it('should delete a Task and return undefined', async () => {
      // Act
      const result = await taskController.remove('1', user);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(taskController, 'remove').mockRejectedValueOnce(new Error());

      // Assert
      expect(taskController.remove('1', user)).rejects.toThrowError();
    });
  });
});
