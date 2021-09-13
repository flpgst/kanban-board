import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

const jwtToken = {
  access_token: 'jwtToken',
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(jwtToken),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the logged in user', async () => {
      // Arrange
      const user = {
        id: 1,
        username: 'admin',
      };

      //Act
      const req = await appController.login(user);

      //Assert
      expect(req).toEqual(jwtToken);
    });
  });
});
