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
import { RouteDto } from './dto/route.dto';
import { VehicleService } from '../vehicle/vehicle.service';
import { VehicleController } from '../vehicle/vehicle.controller';
import { VehicleDto } from '../vehicle/dto/vehicle.dto';
import { ElectricCost } from './template-method/electric-cost';
import { HttpException, HttpStatus } from "@nestjs/common";

describe('RoutesController (Crear Ruta)', () => {
  let placesController: PlaceOfInterestController;
  let placesService: PlaceOfInterestService;
  let userService: UserService;
  let authController: AuthController;
  let routesController: RoutesController;
  let routesService: RoutesService;
  let jwtService: JwtService;
  let authService: AuthService;
  let vehicleService: VehicleService;
  let vehicleController: VehicleController;

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
      controllers: [RoutesController, AuthController, PlaceOfInterestController, VehicleController],
      providers: [PlaceOfInterestService,
                  UserService, RoutesService, AuthService, VehicleService],
    }).compile();

    placesController = module.get<PlaceOfInterestController>(PlaceOfInterestController);
    placesService = module.get<PlaceOfInterestService>(PlaceOfInterestService);
    userService = module.get<UserService>(UserService);
    authController = module.get<AuthController>(AuthController);
    routesController = module.get<RoutesController>(RoutesController);
    routesService = module.get<RoutesService>(RoutesService);
    authService = module.get<AuthService>(AuthService);
    vehicleController = module.get<VehicleController>(VehicleController);
    vehicleService = module.get<VehicleService>(VehicleService);
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();
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
      expect(error.message).toBe('La direccion de origen debe tener coordenadas o una dirección');
    }
  });
  it('E01 (Válido): debería guardar la ruta válida', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
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
    const route = await routesController.createRoute(request, start, end, routeOptions);
    route.name = 'Castellón-Valencia';
    const savedRoute = await routesController.saveRoute(request, route);

    expect(savedRoute.start).toBe(route.start);
    expect(savedRoute.end).toBe(route.end);

  })
  it('E03 (Inválido): debería saltar una excepción', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = authController.register(user);
    const request = {
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
    try{
      const route = await routesController.createRoute(request, start, end, routeOptions);
      route.name = 'Castellón-Valencia';
      const savedRoute = await routesController.saveRoute(request, route);
    }catch(error){
      expect(error.message).toBe('Usuario no autentificado');
    }
  })
  it('E01 (Válido): debería listar la ruta', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
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
    const route = await routesController.createRoute(request, start, end, routeOptions);
    route.name = 'Castellón-Valencia';
    const savedRoute = await routesController.saveRoute(request, route);
    expect(savedRoute.userId).toBe(registered.id)
    const routes = await routesController.getRoutesOfUser(request);

    expect(routes.length).toBe(1);
    expect(routes[0].id).toBe(savedRoute.id);

  })
  it('E03 (inválido): debería lanzar la excepción user not logged', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
    const request = {
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
    try{
      const route = await routesController.createRoute(request, start, end, routeOptions);
      route.name = 'Castellón-Valencia';
      const savedRoute = await routesController.saveRoute(request, route);
      expect(savedRoute.userId).toBe(registered.id)
      const routes = await routesController.getRoutesOfUser(request);
    }catch(error){
      expect(error.message).toBe('Usuario no autentificado');
    }
  })
  it('E01 (válido): debería borrar la ruta', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
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

    const route = await routesController.createRoute(request, start, end, routeOptions);
    route.name = 'Castellón-Valencia';
    const savedRoute = await routesController.saveRoute(request, route);

    const deleted = await routesController.deleteVehicle(request, savedRoute.id);

    expect(deleted).toBe('Ruta eliminada')
  })
  it('E02 (Inválido): debería lanzar la excepción de ruta no existe', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
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

    const route = await routesController.createRoute(request, start, end, routeOptions);
    route.name = 'Castellón-Valencia';
    const savedRoute = await routesController.saveRoute(request, route);

    try{
      const deleted = await routesController.deleteVehicle(request, 7);
      fail('Se esperaba que lanzara la excepción InvalidVehicleException');
    }catch(error){
      expect(error.message).toBe('La ruta no existe')
    }    
  })
  it('E01 (Válido): debería añadir la ruta a favorito', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
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

    const route = await routesController.createRoute(request, start, end, routeOptions);
    route.name = 'Castellón-Valencia';
    let savedRoute = await routesController.saveRoute(request, route);
    
    savedRoute.fav = true;

    const updatedRoute = await routesController.addFavouriteRoute(savedRoute, request)

    expect(updatedRoute.fav).toBe(true)
  })
  it('E02 (inválido): debería saltar que la ruta no existe', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
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

    const route = await routesController.createRoute(request, start, end, routeOptions);
    route.name = 'Castellón-Valencia';
    route.fav = true;

    try{
      const updatedRoute = await routesController.addFavouriteRoute(route, request);
      fail('Se esperaba que lanzara la excepción InvalidVehicleException');
    }catch(error){
      expect(error.message).toBe('La ruta no existe')
    }
  })
  it('E01 (Válido): debería quitar la ruta a favorito', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
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

    const route = await routesController.createRoute(request, start, end, routeOptions);
    route.name = 'Castellón-Valencia';
    route.fav = true;
    let savedRoute = await routesController.saveRoute(request, route);
    
    savedRoute.fav = false;

    const updatedRoute = await routesController.addFavouriteRoute(savedRoute, request)

    expect(updatedRoute.fav).toBe(false)
  })
  it('E02 (inválido): debería saltar que la ruta no existe', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
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

    const route = await routesController.createRoute(request, start, end, routeOptions);
    route.name = 'Castellón-Valencia';
    route.fav = false;

    try{
      const updatedRoute = await routesController.addFavouriteRoute(route, request);
      fail('Se esperaba que lanzara la excepción InvalidVehicleException');
    }catch(error){
      expect(error.message).toBe('La ruta no existe')
    }
  })

  it('E01 (válido): debería calcular el coste asociado a una ruta para un vehículo eléctrico', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();
    
    //Creamos al usuario y lo registramos
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };

    const registered = await authController.register(user);

    const request = {
      user: registered,
    };

    //Creamos un vehiculo eléctrico y lo guardamos al usuario anterior
    const vehicleDto: VehicleDto = {
      registration: '1234ABC',
      name: 'coche',
      carbType: 'electric',
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    await vehicleController.addVehicle(request, vehicleDto);

    const response = await vehicleController.getVehicleOfUser(request);

    const vehicle = response[0];

    //Creamos una ruta y la guardamos al usuario
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

    const route = await routesController.createRoute(request, start, end, routeOptions);
    route.name = 'Castellón-Valencia';
    await routesController.saveRoute(request, route);
    const routes = await routesController.getRoutesOfUser(request);
    
    //Creamos la clase que se encarga de hacer el cálculo del coste electrico
    const costeElectrico = new ElectricCost();
    const precio = await costeElectrico.calcularCoste(vehicle, routes[0]);

    //Comprobar resultado
    expect(precio).toBeLessThan(10);
    expect(precio).toBeGreaterThanOrEqual(1);
  })
  
  it('E02 (inválido): debería saltar que el tipo de coche es incorrecto', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();
    routesService.clearDatabase();
    
    //Creamos al usuario y lo registramos
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };

    const registered = await authController.register(user);

    const request = {
      user: registered,
    };

    //Creamos un vehiculo eléctrico y lo guardamos al usuario anterior
    const vehicleDto: VehicleDto = {
      registration: '1234ABC',
      name: 'coche',
      carbType: 'gasolina',
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    await vehicleController.addVehicle(request, vehicleDto);

    const response = await vehicleController.getVehicleOfUser(request);

    const vehicle = response[0];

    //Creamos una ruta y la guardamos al usuario
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

    const route = await routesController.createRoute(request, start, end, routeOptions);
    route.name = 'Castellón-Valencia';
    await routesController.saveRoute(request, route);
    const routes = await routesController.getRoutesOfUser(request);
    
    //Creamos la clase que se encarga de hacer el cálculo del coste electrico
    const costeElectrico = new ElectricCost();
    try {
      const precio = await costeElectrico.calcularCoste(vehicle, routes[0]);
      fail('Se esperaba que lanzara la excepción InvalidTypeVehicleException');
    } catch (error) {
      expect(error.message).toBe('InvalidTypeVehicleException');
      expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    }
  })
  
  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await userService.clearDatabase();
    await placesService.clearDatabase();
    await routesService.clearDatabase();
  });
});
