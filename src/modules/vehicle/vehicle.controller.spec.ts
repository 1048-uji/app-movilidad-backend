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

  it('debería devolver la lista de vehiculos del usuario autentificado', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();
    await vehicleService.clearDatabase();
  
    // Crear un usuario autentificado
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    
    const registered = await authController.register(user);
  
    // Añadir vehiculo para el usuario
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
      user: registered
    };
    
    // Realizar la solicitud para añadir un nuevo vehiculo

    await vehicleController.addVehicle(request, vehicleDto);

    // Consultar la lista de vehiculos del usuario
    const response = await vehicleController.getVehicleOfUser(request);
  
    // Verificar que la respuesta contenga los lugares de interés esperados
    expect(response).toHaveLength(1);
    expect(response[0].name).toEqual(vehicleDto.name);
    expect(response[0].registration).toEqual(vehicleDto.registration);
    });
  
    //Escenario 2
    it('debería lanzar DataBaseInaccessibleException si la base de datos no está disponible', async () => {

      await userService.clearDatabase();
      await vehicleService.clearDatabase();
      // Crear un usuario autentificado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      // Intentar consultar la lista de vehiculos
      try {
        jest.spyOn(vehicleService, 'getVehiclesOfUser').mockRejectedValue(new Error('DataBaseInaccessibleException'));
        await vehicleController.getVehicleOfUser({user: registered});
      } catch (error) {
        // Verificar que la excepción lanzada sea DataBaseInaccessibleException
        expect(error.message).toBe('DataBaseInaccessibleException');
      }
    });

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await userService.clearDatabase();
  });
});
