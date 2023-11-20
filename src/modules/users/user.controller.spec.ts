import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { AuthController } from '../auth/auth.controller';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthService } from '../../modules/auth/auth.service';
import { UserRepositoryMock } from '../../mocks/user.repository.mock';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersController', () => {
  let controller: UserController;
  let usService: UserService;
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController, AuthController],
      providers: [
        UserService,
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    authController = module.get<AuthController>(AuthController);
    usService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('Registra un usuario válido', async () => {
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };

    // Limpiar la base de datos antes de la prueba
    await usService.clearDatabase();

    // Realizar la solicitud al endpoint de registro
    const response = await authController.register(user);

    // Verificar la respuesta del controlador
    expect(response.email).toEqual(user.email);

    // Verificar que el usuario se haya registrado en el servicio
    const usuariosRegistrados = await usService.getUsers();
    expect(usuariosRegistrados).toHaveLength(1);
  });

  it('debería lanzar Database not accesible si la base de datos no está disponible', async () => {
    // Simular que la base de datos no está disponible
    jest.spyOn(authService, 'register').mockImplementation(async () => {
      throw new HttpException('Database not accesible', HttpStatus.INTERNAL_SERVER_ERROR);
    });
  
    // Realizar la solicitud al endpoint de registro
    try {
      await authController.register({
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
  it('debería iniciar sesión con un usuario correcto y cargar datos de la base de datos', async () => {
    // Limpiar la base de datos antes de la prueba
    await usService.clearDatabase();

    // Crear un usuario en la base de datos
    const user: User = {
      id: 1,
      username: 'José Antonio',
      email: 'al386161@uji.es',
      password: await bcrypt.hash('Tp386161', 10), // Hashear la contraseña antes de almacenarla
    };
    await authService.register(user);

    // Realizar la solicitud al endpoint de inicio de sesión
    const loginResponse = await authController.login({
      email: 'al386161@uji.es',
      password: 'Tp386161',
    });
    const accessToken = await jwtService.signAsync({ id: user.id, email: user.email });
    // Verificar que la respuesta del controlador contiene el token
    expect(loginResponse).toHaveProperty(accessToken);

    // Decodificar el token para obtener la información del usuario
    try {
      const decoded = jwtService.decode(loginResponse.token);
      // Verificar que el usuario en el token coincide con el usuario registrado
      expect(decoded.email).toBe(user.email);
    } catch (error) {
      // Manejar el error (token inválido, expirado, etc.)
      throw new Error('Error al decodificar el token');
    }
    
  });

// Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await usService.clearDatabase();
  });
});