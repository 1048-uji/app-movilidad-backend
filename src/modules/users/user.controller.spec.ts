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
import { jwtConstants } from '../auth/strategy/jwt.constant';import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { CarbType, Vehicle } from '../../entities/vehicle.entity';
import { ConfigModule } from '@nestjs/config';
import { Route } from '../../entities/route.entity';
import { VehicleController } from '../vehicle/vehicle.controller';
import { VehicleDto } from '../vehicle/dto/vehicle.dto';
import { UserDto } from './dto/user.dto';
import { RouteOptionsDto, Strategy } from '../routes/dto/routeOptions.dto';
import { VehicleService } from '../vehicle/vehicle.service';
import { PlaceOfInterestService } from '../place-of-interest/place-of-interest.service';
import { RoutesService } from '../routes/routes.service';

describe('UsersController', () => {
  let controller: UserController;
  let usService: UserService;
  let vehicleService: VehicleService;
  let placesService: PlaceOfInterestService;
  let routesService: RoutesService;
  let authController: AuthController;
  let authService: AuthService;
  let vehicleController: VehicleController

 
  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          TypeOrmModule.forRoot({
            type: 'postgres',
            host:'dpg-cpcae4uct0pc738n223g-a.frankfurt-postgres.render.com',
            port: 5432,
            username: 'postgresql_ei1039_1048_user',
            password: '9DZpKIgJacz9qoNQmBhbYvW0xUYP4pyv',
            database: 'postgresql_ei1039_1048',
            entities: [User, PlaceOfInterest, Vehicle, Route],
            synchronize: true,
            ssl: {rejectUnauthorized: false},
          }),
          TypeOrmModule.forFeature([User, Vehicle, PlaceOfInterest, Route]),
          JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '30d' },
          }),
        ],
        controllers: [UserController, AuthController, VehicleController],
        providers: [
          AuthService,
          UserService,
          VehicleService,
          PlaceOfInterestService,
          RoutesService,
        ],
      }).compile();

    controller = module.get<UserController>(UserController);
    authController = module.get<AuthController>(AuthController);
    usService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    vehicleController = module.get<VehicleController>(VehicleController);
    controller = module.get<UserController>(UserController);
    vehicleService = module.get<VehicleService>(VehicleService);
    placesService = module.get<PlaceOfInterestService>(PlaceOfInterestService);
    routesService = module.get<RoutesService>(RoutesService);
    await usService.clearDatabase();
    await placesService.clearDatabase();
    await vehicleService.clearDatabase();
    await routesService.clearDatabase();
  });

  it('(Válido): Registra un usuario válido', async () => {
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };

    // Limpiar la base de datos antes de la prueba
    //await usService.clearDatabase();

    // Realizar la solicitud al endpoint de registro
    const response = await authController.register(user);

    // Verificar la respuesta del controlador
    expect(response.email).toEqual(user.email);

    // Verificar que el usuario se haya registrado en el servicio
    const usuariosRegistrados = await usService.getUsers();
    expect(usuariosRegistrados).toHaveLength(1);
  });

  it('(Inválido): debería lanzar Database not accesible si la base de datos no está disponible', async () => {
  
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

  it('(Válido): debería iniciar sesión con un usuario correcto y cargar datos de la base de datos', async () => {
    // Limpiar la base de datos antes de la prueba
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio Login',
      password: 'Tp386161',
    };
    //await usService.clearDatabase();

    const userRegistered = await authController.register(user);
    
    // Realizar la solicitud al endpoint de inicio de sesión
    const loginResponse = await authController.login({
      email: 'al386161@uji.es',
      password: 'Tp386161',
    });
    //const accessToken = await jwtService.signAsync({ id: userRegistered.id, email: userRegistered.email });
    // Verificar que la respuesta del controlador contiene el token
    try {
      // Verificar que el usuario en el token coincide con el usuario registrado
      expect(loginResponse.token).toBeDefined();
    } catch (error) {
      // Manejar el error (token inválido, expirado, etc.)
      throw new Error('Error al decodificar el token');
    }
    
  });

  it('(Inválido): debería lanzar InvalidPasswordException para un usuario con contraseña incorrecta', async () => {
    // Limpiar la base de datos antes de la prueba
    //await usService.clearDatabase();

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
  it('(Válido): debería eliminar la cuenta de un usuario autenticado', async () => {
    // Limpiar la base de datos antes de la prueba
    //await usService.clearDatabase();

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

  it('(Inválido): debería lanzar una excepción si se intenta borrar la cuenta de otro usuario', async () => {
    // Limpiar la base de datos antes de la prueba
    //await usService.clearDatabase();

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
  it('(Válido): debería actualizar el vehiculo 1234ABC como default y Fast como tipo de ruta', async () => {
    // Limpiar la base de datos antes de la prueba
    //await usService.clearDatabase();

    // Crear un usuario en la base de datos
    const user: RegisterDto = {
      username: 'José Antonio',
      email: 'al386161@uji.es',
      password: 'Tp386161',
    };
    const registered = await authService.register(user);
    const request = {
      user: registered,
    };

    const vehicleDto: VehicleDto = {
      registration: '1234ABC',
      name: 'coche',
      carbType: CarbType.Biodiesel,
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };
    const vehicle = await vehicleController.addVehicle(request, vehicleDto);
    
    const userUpdate: UserDto = {
      id: registered.id,
      username: registered.username,
      email: registered.email,
      password: registered.password,
      routeDefault: Strategy.FAST,
      vehicleDefaultId: vehicle.id,
    } 
    const userUpdated = await controller.updateUser(userUpdate, request) 
    
    expect(userUpdated.vehicleDefault.id).toBe(vehicle.id);
    expect(userUpdated.routeDefault).toBe(Strategy.FAST);
  });
  it('(Inválido): debería lanzar la excepción de vehiculo no existe', async () => {
    // Limpiar la base de datos antes de la prueba
    //await usService.clearDatabase();

    // Crear un usuario en la base de datos
    const user: RegisterDto = {
      username: 'José Antonio',
      email: 'al386161@uji.es',
      password: 'Tp386161',
    };
    const registered = await authService.register(user);
    const request = {
      user: registered,
    };

    const vehicleDto: VehicleDto = {
      registration: '1234ABC',
      name: 'coche',
      carbType: CarbType.Biodiesel,
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };
    const vehicle = await vehicleController.addVehicle(request, vehicleDto);
    
    const userUpdate: UserDto = {
      id: registered.id,
      username: registered.username,
      email: registered.email,
      password: registered.password,
      routeDefault: Strategy.FAST,
      vehicleDefaultId: 7,
    } 
    try{
      const userUpdated = await controller.updateUser(userUpdate, request) 
    }catch(error){
      expect(error.message).toBe('Vehicle does not exist');
    }
  });


// Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await usService.clearDatabase();
    await placesService.clearDatabase();
    await vehicleService.clearDatabase();
    await routesService.clearDatabase();
  });
});