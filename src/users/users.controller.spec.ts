import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';

const user: User = {
  id: 1,
  username: 'John Doe',
  password: '123456',
};

const updatedUser: User = {
  id: 1,
  username: 'John Doe',
  password: '111',
};

const users: User[] = [user];

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'UsersService',
          useValue: {
            create: jest.fn().mockResolvedValue(user),
            findAll: jest.fn().mockResolvedValue(users),
            findOne: jest.fn().mockResolvedValue(user),
            update: jest.fn().mockResolvedValue(updatedUser),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an user', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        username: 'John Doe',
        password: '123456',
      };

      // Act
      const result = await controller.create(userDto);

      // Assert
      expect(result).toBe(user);
    });

    it('should throw an error', () => {
      // Arrange
      const userDto: CreateUserDto = {
        username: 'John Doe',
        password: '123456',
      };

      jest.spyOn(controller, 'create').mockRejectedValueOnce(new Error());

      // Act
      const result = controller.create(userDto);

      // Assert
      expect(result).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('should return an list of users', async () => {
      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(users);
    });

    it('should throw an error', () => {
      // Arrange
      jest.spyOn(controller, 'findAll').mockRejectedValueOnce(new Error());

      // Act
      const result = controller.findAll();

      // Assert
      expect(result).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      // Act
      const result = await controller.findOne('John Doe');

      // Assert
      expect(result).toEqual(user);
    });

    it('should throw an error', () => {
      // Arrange

      jest.spyOn(controller, 'findOne').mockRejectedValueOnce(new Error());

      // Act
      const result = controller.findOne('John Doe');

      // Assert
      expect(result).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update an user', async () => {
      // Arrange
      const userDto: UpdateUserDto = {
        username: 'John Doe',
        password: '111',
      };

      // Act
      const result = await controller.update('1', userDto);

      // Assert
      expect(result).toBe(updatedUser);
    });

    it('should throw an error', () => {
      // Arrange
      const userDto: UpdateUserDto = {
        username: 'John Doe',
        password: '111',
      };

      jest.spyOn(controller, 'update').mockRejectedValueOnce(new Error());

      // Act
      const result = controller.update('1', userDto);

      // Assert
      expect(result).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should remove an user', async () => {
      // Act
      const result = await controller.remove('1');

      // Assert
      expect(result).toBe(undefined);
    });

    it('should throw an error', () => {
      // Arrange
      jest.spyOn(controller, 'remove').mockRejectedValueOnce(new Error());

      // Act
      const result = controller.remove('1');

      // Assert
      expect(result).rejects.toThrowError();
    });
  });
});
