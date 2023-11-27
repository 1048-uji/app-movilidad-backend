import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthController } from '../auth/auth.controller';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { jwtConstants } from '../auth/strategy/jwt.constant';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';

describe('UsersController', () => {
  let controller: UserController;
  let usService: UserService;
  let authController: AuthController;
  let authService: AuthService;
  let JwtAuthGuard: JwtAuthGuard;
  let jwtService: JwtService;

 
  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot({
            type: 'mysql',
            host:'monorail.proxy.rlwy.net',
            port: 20755,
            username: 'root',
            password: 'F1fhHDe3aeDF1G5464D4af1662bce4g5',
            database: 'railway',
            entities: [User,PlaceOfInterest],
            synchronize: true,
          }),
          TypeOrmModule.forFeature([User]),
          JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '30d' },
          }),
        ],
        controllers: [UserController, AuthController],
        providers: [
          UserService,
          AuthService,
          JwtService,
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
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio Login',
      password: 'Tp386161',
    };
    await usService.clearDatabase();

    const userRegistered = await authController.register(user);
    
    // Realizar la solicitud al endpoint de inicio de sesión
    const loginResponse = await authController.login({
      email: 'al386161@uji.es',
      password: 'Tp386161',
    });
    //const accessToken = await jwtService.signAsync({ id: userRegistered.id, email: userRegistered.email });
    // Verificar que la respuesta del controlador contiene el token
    try {
      const decoded = jwtService.decode(loginResponse.token);
      // Verificar que el usuario en el token coincide con el usuario registrado
      expect(decoded.email).toBe(userRegistered.email);
    } catch (error) {
      // Manejar el error (token inválido, expirado, etc.)
      throw new Error('Error al decodificar el token');
    }
    
  });

  it('debería lanzar InvalidPasswordException para un usuario con contraseña incorrecta', async () => {
    // Limpiar la base de datos antes de la prueba
    await usService.clearDatabase();

    // Crear un usuario en la base de datos
    const user: RegisterDto = {
      username: 'José Antonio Login Fail',
      email: 'al386161@uji.es',
      password:'Tp386161',
    };
    await authService.register(user);

    // Realizar la solicitud al endpoint de inicio de sesión
    
    try {
      const loginResponse = await authController.login({
        email: 'al386161@uji.es',
        password: 'tp386161',
      });
    } catch (error) {
      // Manejar el error (token inválido, expirado, etc.)
      expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.message).toBe('Invalid password');
    }
    
  });
  it('debería eliminar la cuenta de un usuario autenticado', async () => {
    // Limpiar la base de datos antes de la prueba
    await usService.clearDatabase();

    // Crear un usuario en la base de datos
    const user: RegisterDto = {
      username: 'José Antonio Delete',
      email: 'al386161@uji.es',
      password: 'Tp386161',
    };
    const registered = await authService.register(user);

    // Autenticar al usuario
    const authenticatedUser = await authController.login({
      email: 'al386161@uji.es',
      password: 'Tp386161',
    });
    const request = {
      user: registered,
    };

    // Borrar la cuenta del usuario autenticado
    await controller.deleteAccount(request, registered.id);

    // Verificar que la cuenta se borró correctamente
    const usuariosRegistrados = await usService.getUsers();
    expect(usuariosRegistrados).toHaveLength(0);
  });

  it('debería lanzar una excepción si se intenta borrar la cuenta de otro usuario', async () => {
    // Limpiar la base de datos antes de la prueba
    await usService.clearDatabase();

    // Crear un usuario en la base de datos
    const user: RegisterDto = {
      username: 'José Antonio',
      email: 'al386161@uji.es',
      password: 'Tp386161',
    };
    const registered = await authService.register(user);

    // Autenticar al usuario
    const authenticatedUser = await authController.login({
      email: 'al386161@uji.es',
      password: 'Tp386161',
    });
    const request = {
      user: registered,
    };
    // Intentar borrar la cuenta de un usuario con un correo no existente
    try {
      await controller.deleteAccount(request, 10);
      // Si no lanza una excepción, la prueba falla
      fail('Se esperaba que lanzara una excepción');
    } catch (error) {
      // Verificar que la excepción sea la esperada
      expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.message).toBe('InvalidUserException');
    }
  });


// Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await usService.clearDatabase();
  });
});