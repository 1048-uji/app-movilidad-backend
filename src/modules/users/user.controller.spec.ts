import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import * as bcrypt from 'bcrypt';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('UsersController (Inicio de Sesión)', () => {
  let userController: UserController;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'pending',
          signOptions: { expiresIn: '1h' },
        }),
        AuthModule,
      ],
      controllers: [UserController],
      providers: [UserService, AuthService, JwtStrategy],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('debería iniciar sesión con un usuario correcto y cargar datos de la base de datos', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();

    // Crear un usuario en la base de datos
    const user: User = {
      id: 1,
      username: 'José Antonio',
      email: 'al386161@uji.es',
      password: await bcrypt.hash('Tp386161', 10), // Hashear la contraseña antes de almacenarla
    };
    await userService.registerUser(user);

    // Realizar la solicitud al endpoint de inicio de sesión
    const loginResponse = await userController.login({
      email: 'al386161@uji.es',
      password: 'Tp386161',
    });

    // Verificar que la respuesta del controlador contiene el token
    expect(loginResponse).toHaveProperty('accessToken');

    // Decodificar el token para obtener la información del usuario
    const decodedUser = await authService.verifyToken(loginResponse);

    // Verificar que el usuario en el token coincide con el usuario registrado
    expect(decodedUser.email).toBe(user.email);
  });

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await userService.clearDatabase();
  });
});
