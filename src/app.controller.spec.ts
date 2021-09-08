import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    console.log('appControler :>> ', appController);
  });

  describe('root', () => {
    it('should return the logged in user', () => {
      const user = {
        id: 1,
        username: 'admin',
      };

      expect(appController.getProfile(user).toBe(user));
    });
  });
});
