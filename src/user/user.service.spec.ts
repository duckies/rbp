import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserFactory } from '../../test/factories/User';
import { User } from './user.entity';
import { Provider } from '../auth/auth.service';

jest.mock('./user.service');

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should return an array of users', async () => {
    const users = UserFactory.buildList(10);

    jest.spyOn(service, 'findAll').mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
  });

  it('should return a single user', async () => {
    const user = UserFactory.build();

    jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(user) as Promise<User>);

    expect(await service.findOne(1)).toEqual(user);
  });

  it('should return a single user from a payload', async () => {
    const user = UserFactory.build();

    jest.spyOn(service, 'findOneByJwtPayload').mockReturnValue(Promise.resolve(user) as Promise<User>);

    expect(await service.findOneByJwtPayload({ id: 1 })).toEqual(user);
  });

  it('should return a single user from a provider id', async () => {
    const user = UserFactory.build();

    jest.spyOn(service, 'findOneByProviderId').mockReturnValue(Promise.resolve(user) as Promise<User>);

    expect(await service.findOneByProviderId(1, Provider.BLIZZARD)).toEqual(user);
  });
});
