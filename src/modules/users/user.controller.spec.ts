import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController (Eliminar Cuenta - Valido)', () => {
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

  it('debería eliminar la cuenta de un usuario autenticado', async () => {
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

    // Verificar que la autenticación fue exitosa
    expect(authenticatedUser).toBeDefined();

    // Borrar la cuenta del usuario autenticado
    await userController.deleteAccount(user);

    // Verificar que la cuenta se borró correctamente
    const usuariosRegistrados = await userService.getUsers();
    expect(usuariosRegistrados).toHaveLength(0);
  });

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await userService.clearDatabase();
  });
});