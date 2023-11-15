import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

describe('UsersController', () => {
  let controller: UserController;
  let usService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    usService = module.get<UserService>(UserService);
  });

  it('Registra un usuario válido', async () => {
    const user: User = {
      id: 1,
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };

    // Limpiar la base de datos antes de la prueba
    await usService.clearDatabase();

    // Realizar la solicitud al endpoint de registro
    const response = await controller.registerUser(user);

    // Verificar la respuesta del controlador
    expect(response).toEqual(user);

    // Verificar que el usuario se haya registrado en el servicio
    const usuariosRegistrados = await usService.getUsers();
    expect(usuariosRegistrados).toHaveLength(1);
    expect(usuariosRegistrados[0]).toEqual(user);
  });

  it('debería lanzar Database not accesible si la base de datos no está disponible', async () => {
    // Simular que la base de datos no está disponible
    jest.spyOn(usService, 'registerUser').mockImplementation(async () => {
      throw new HttpException('Database not accesible', HttpStatus.INTERNAL_SERVER_ERROR);
    });
  
    // Realizar la solicitud al endpoint de registro
    try {
      await controller.registerUser({
        id: 1,
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      });
    } catch (error) {
      // Verificar que la respuesta sea un error 500 y contenga el mensaje esperado
      expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.message).toBe('Database not accesible');
    }
  });

// Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await usService.clearDatabase();
  });
});