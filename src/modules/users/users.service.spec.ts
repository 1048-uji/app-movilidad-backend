import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Users } from 'src/entities/users.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('registra un usuario con correo y contraseña válidos', async () => {
    const user: Users = {
      id: 1,
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };

    const userRegistered = await service.registerUser(user.email, user.password);

    expect(userRegistered).toEqual(user);
  });
});
