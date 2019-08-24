import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserFactory } from '../../test/factories/User';
import { ComposeGuard } from '../auth/guards/compose.guard';

jest.mock('./user.service');

describe.only('User Controller', () => {
  let userController: UserController;
  let userService: UserService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideGuard(ComposeGuard)
      .useValue({ canActivate: () => true })
      .compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = UserFactory.buildList(5);
      const response = { result: users, total: 5 };

      jest
        .spyOn(userService, 'findAll')
        .mockImplementation(async () => response);

      expect(await userController.findAll()).toBe(response);
    });
  });
});
