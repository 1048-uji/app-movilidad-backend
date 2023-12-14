import { Test, TestingModule } from '@nestjs/testing';
import { RoutesController } from './routes.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { Vehicle } from '../../entities/vehicle.entity';
import { Route } from '../../entities/route.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/strategy/jwt.constant';
import { AuthController } from '../auth/auth.controller';
import { PlaceOfInterestService } from '../place-of-interest/place-of-interest.service';
import { UserService } from '../users/user.service';
import { RoutesService } from './routes.service';
import { PlaceOfInterestController } from '../place-of-interest/place-of-interest.controller';
import { RegisterDto } from '../auth/dto/register.dto';
import { PlaceOfinterestDto } from '../place-of-interest/dto/placeOfInterest.dto';
import { RouteOptionsDto, Strategy, VehicleType } from './dto/routeOptions.dto';
import { AuthService } from '../auth/auth.service';

describe('RoutesController (Crear Ruta)', () => {
  let placesController: PlaceOfInterestController;
  let placesService: PlaceOfInterestService;
  let userService: UserService;
  let authController: AuthController;
  let routesController: RoutesController;
  let routesService: RoutesService;
  let jwtService: JwtService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host:'ep-long-leaf-50431422.eu-central-1.aws.neon.fl0.io',
          port: 5432,
          username: 'fl0user',
          password: 'MNA8bza5YdXg',
          database: 'database',
          entities: [User, PlaceOfInterest, Vehicle, Route],
          synchronize: true,
          ssl: {rejectUnauthorized: false},
        }),
        TypeOrmModule.forFeature([User, PlaceOfInterest, Vehicle, Route]),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '30d' },
        }),
      ],
      controllers: [RoutesController, AuthController, PlaceOfInterestController],
      providers: [PlaceOfInterestService,
                  UserService, RoutesService, AuthService],
    }).compile();

    placesController = module.get<PlaceOfInterestController>(PlaceOfInterestController);
    placesService = module.get<PlaceOfInterestService>(PlaceOfInterestService);
    userService = module.get<UserService>(UserService);
    authController = module.get<AuthController>(AuthController);
    routesController = module.get<RoutesController>(RoutesController);
    routesService = module.get<RoutesService>(RoutesService);
    authService = module.get<AuthService>(AuthService);
  });

  it('E01 (Válido): debería devolver el trayecto entre dos lugares y guardar el estado en el servidor', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    // Datos del escenario E01 (Válido)
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = authController.register(user);
    const request = {
      user: registered,
    };
    const start: PlaceOfinterestDto = 
      { name: 'Castellón',
        lon: '-0.0576800', 
        lat: '39.9929000', 
        fav: false };
    const end: PlaceOfinterestDto =
    { name: 'Valencia',
      lon: '-0.3773900', 
      lat: '39.4697500', 
      fav: false 
    };
    const routeOptions: RouteOptionsDto = {
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };


    // Realizar la solicitud para crear una ruta válida
    const response = await routesController.createRoute( request, start, end, routeOptions);

    // Verificar que la respuesta tenga la información de la ruta esperada
    expect(response.start).toBe(start.lon+','+start.lat);
    expect(response.end).toBe(end.lon+','+end.lat);
  });

  it('E02 (Inválido): debería lanzar la excepción InvalidVehicleException al intentar realizar un viaje con un vehículo inválido', async () => {
    // ... Configuración inicial ...

    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    // Datos del escenario E01 (Válido)
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = authController.register(user);
    const request = {
      user: registered,
    };
    const start: PlaceOfinterestDto = 
      { name: '',
       };
    const end: PlaceOfinterestDto =
    { name: 'Valencia',
      lon: '-0.3773900', 
      lat: '39.4697500', 
      fav: false 
    };
    const routeOptions: RouteOptionsDto = {
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    // ... Configuración del escenario ...

    // Realizar la solicitud para crear una ruta inválida
    try {
      const response = await routesController.createRoute( request, start, end, routeOptions);
      // Si no lanza una excepción, la prueba falla
      fail('Se esperaba que lanzara la excepción InvalidVehicleException');
    } catch (error) {
      // Verificar que la excepción sea la esperada
      expect(error.message).toBe('Start point must have either lat and lon or address');
    }
  });

  // ... Otras pruebas ...

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await userService.clearDatabase();
    await placesService.clearDatabase();
  });
});
