import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { VehicleDto } from './dto/vehicle.dto';
import { User } from '../../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../users/user.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/strategy/jwt.constant';
import { Vehicle } from '../../entities/vehicle.entity';

describe('VehicleController (Registro de Vehículos)', () => {
  let vehicleController: VehicleController;
  let vehicleService: VehicleService;
  let userService: UserService;
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'monorail.proxy.rlwy.net',
          port: 20755,
          username: 'root',
          password: 'F1fhHDe3aeDF1G5464D4af1662bce4g5',
          database: 'railway',
          entities: [Vehicle, User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Vehicle]),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '30d' },
        }),
      ],
      controllers: [VehicleController, AuthController],
      providers: [VehicleService, UserService, AuthService],
    }).compile();

    vehicleController = module.get<VehicleController>(VehicleController);
    vehicleService = module.get<VehicleService>(VehicleService);
    userService = module.get<UserService>(UserService);
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('debería registrar un vehículo válido', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();

    // Crear un usuario registrado
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = await authController.register(user);

    // Datos para el nuevo vehículo
    const vehicleDto: VehicleDto = {
      registration: '1234ABC',
      name: 'coche',
      carbType: 'gasolina',
      model: 'X',
      consum: 1.5,
      brand: 'Una',
      fav: false,
    };

    const request = {
      user: registered,
    };

    // Registrar el vehículo
    const vehicle = await vehicleController.addVehicle(request, vehicleDto);

    expect(vehicle.registration).toBe(vehicleDto.registration)
  });

  it('debería lanzar una excepción si la base de datos no está disponible al intentar registrar un vehículo', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();
    await vehicleService.clearDatabase();

    // Crear un usuario registrado
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = await authController.register(user);

    const request = {
      user: registered,
    };
    // Intentar registrar un vehículo cuando la base de datos no está disponible
    try {
      const vehicleDto: VehicleDto = {
        registration: '1234ABC',
        name: 'coche',
        carbType: 'gasolina',
        model: 'X',
        consum: 1.5,
        brand: 'Una',
        fav: false,
      };
      await vehicleController.addVehicle(request, vehicleDto);
      // Si no lanza una excepción, la prueba falla
      fail('Se esperaba que lanzara la excepción DataBaseInaccessibleException');
    } catch (error) {
      // Verificar que la excepción sea la esperada
      expect(error.message).toBe('DataBaseInaccessibleException');
    }
  });

  it('debería eliminar el vehiculo de un usuario autenticado', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();
    await vehicleService.clearDatabase();

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
    await userService.clearDatabase();
  });
});
