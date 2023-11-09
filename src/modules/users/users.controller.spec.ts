import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('registra un usuario con correo y contraseña válidos', async () => {
    const usuario = {
      mail: 'al386161@uji.es',
      password: 'Tp386161',
    };

    const userRegistered = await controller.registerUser(usuario.mail, usuario.password);

    expect(userService.registerUser).toHaveBeenCalledWith(usuario.mail, usuario.password);
    expect(userRegistered).toEqual(usuario);
  });
});
