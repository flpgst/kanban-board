import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from '../boards/entities/board.entity';
import { List } from '../lists/entities/list.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const user: User = {
  id: 1,
  username: 'admin',
  password: '1234',
};

const boardEntity: Board = {
  id: 1,
  name: 'Board 1',
  users: [user],
};

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

describe('TasksService', () => {
  let taskService: TasksService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            save: jest.fn().mockResolvedValue(taskEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedTask),
            findOne: jest.fn().mockResolvedValue(taskEntityList[0]),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
    expect(taskRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
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
      const result = await taskService.create(taskDto);

      // Assert
      expect(result).toEqual(taskEntityList[0]);
    });

    it('should throw an exception', async () => {
      // Arrange
      const taskDto: CreateTaskDto = {
        title: 'Task-1',
        description: 'First testing task',
        scrumPonctuation: 1,
        status: TaskStatus.TO_DO,
        archived: false,
        list: listEntity,
      };

      jest.spyOn(taskRepository, 'save').mockRejectedValueOnce(new Error());

      // Assert
      expect(taskService.create(taskDto)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      // Arrange
      const taskDto: UpdateTaskDto = {
        title: 'Task-1',
        description: 'First testing task',
        scrumPonctuation: 1,
        status: TaskStatus.DONE,
        archived: false,
        list: listEntity,
      };

      jest
        .spyOn(taskService, 'findOne')
        .mockResolvedValueOnce(taskEntityList[0]);

      jest.spyOn(taskRepository, 'findOne').mockResolvedValueOnce(updatedTask);

      // Act
      const result = await taskService.update(1, taskDto, user);

      // Assert
      expect(result).toEqual(updatedTask);
    });

    it('should throw an exception', async () => {
      // Arrange
      const taskDto: CreateTaskDto = {
        title: 'Task-1',
        description: 'First testing task',
        scrumPonctuation: 1,
        status: TaskStatus.DONE,
        archived: false,
        list: listEntity,
      };

      jest.spyOn(taskService, 'update').mockRejectedValueOnce(new Error());

      // Act
      const result = taskService.update(1, taskDto, user);

      // Assert
      expect(result).rejects.toThrowError();
    });
  });
  describe('delete', () => {
    it('should remove a task', () => {
      // Act
      const result = taskService.remove(1, user);

      // Assert
      expect(result).toBeUndefined;
    });
    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(taskRepository, 'delete').mockRejectedValueOnce(new Error());

      // Assert
      expect(taskService.remove(1, user)).rejects.toThrowError();
    });
  });
});
