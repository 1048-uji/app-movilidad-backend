import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('registra un usuario con correo y contraseña válidos', async () => {
    const usuario = {
      mail: 'al386161@uji.es',
      password: 'Tp386161',
    };

    const userRegistered = await service.registerUser(usuario.mail, usuario.password);

    expect(userRegistered).toEqual(usuario);
  });
});
