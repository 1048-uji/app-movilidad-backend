
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersController (Cerrar Sesión - Valido)', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('debería cerrar la sesión de un usuario autenticado', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();

    // Crear un usuario en la base de datos
    const user: User = {
      id: 1,
      username: 'José Antonio',
      email: 'al386161@uji.es',
      password: 'Tp386161',
    };
    await userService.registerUser(user);

    // Autenticar al usuario
    const authenticatedUser = await userController.login({
      email: 'al386161@uji.es',
      password: 'Tp386161',
    });

    // Cerrar sesión del usuario
    await userController.logout(authenticatedUser);

    // Verificar que la sesión se cerró correctamente
    expect(userService.getAuthenticatedUsers()).toHaveLength(0);
  });

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await userService.clearDatabase();
  });
});