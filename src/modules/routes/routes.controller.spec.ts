import { Test, TestingModule } from '@nestjs/testing';
import { RoutesController } from './routes.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { CarbType, Vehicle } from '../../entities/vehicle.entity';
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
import { CaloriesCost } from './template-method/calories-cost';
import { HttpException, HttpStatus } from "@nestjs/common";
import { VehicleController } from '../vehicle/vehicle.controller';
import { VehicleService } from '../vehicle/vehicle.service';
import { VehicleDto } from '../vehicle/dto/vehicle.dto';
import { ElectricCost } from './template-method/electric-cost'
import { FuelCost } from './template-method/fuel-cost';

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
          host:'dpg-cpcae4uct0pc738n223g-a.frankfurt-postgres.render.com',
          port: 5432,
          username: 'postgresql_ei1039_1048_user',
          password: '9DZpKIgJacz9qoNQmBhbYvW0xUYP4pyv',
          database: 'postgresql_ei1039_1048',
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
      providers: [PlaceOfInterestService, UserService, RoutesService, AuthService, VehicleService],
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
    await userService.clearDatabase();
    await placesService.clearDatabase();
    await vehicleService.clearDatabase();
    await routesService.clearDatabase();
  });

  it('(Válido): debería devolver el trayecto entre dos lugares y guardar el estado en el servidor', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = authController.register(user);
    const request = {
      user: registered,
    };
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };


    // Realizar la solicitud para crear una ruta válida
    const response = await routesController.createRoute( request, routeOptions);

    // Verificar que la respuesta tenga la información de la ruta esperada
    expect(response.start).toBe(routeOptions.startLon+','+routeOptions.startLat);
    expect(response.end).toBe(routeOptions.endLon+','+routeOptions.endLat);
  });

  it('(Inválido): debería lanzar la excepción InvalidVehicleException al intentar realizar un viaje con un vehículo inválido', async () => {
    // ... Configuración inicial ...

    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = authController.register(user);
    const request = {
      user: registered,
    };
    const routeOptions: RouteOptionsDto = {
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };


    // Realizar la solicitud para crear una ruta inválida
    try {
      const response = await routesController.createRoute( request, routeOptions);
      // Si no lanza una excepción, la prueba falla
      fail('Se esperaba que lanzara la excepción InvalidVehicleException');
    } catch (error) {
      // Verificar que la excepción sea la esperada
      expect(error.message).toBe('La direccion de origen debe tener coordenadas o una dirección');
    }
  });
  it('(Válido): debería guardar la ruta válida', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = authController.register(user);
    const request = {
      user: registered,
    };
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };
    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.geometry=null
    const savedRoute = await routesController.saveRoute(request, route);

    expect(savedRoute.start).toBe(route.start);
    expect(savedRoute.end).toBe(route.end);

  })
  it('(Inválido): debería saltar una excepción', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = authController.register(user);
    const request = {
    };
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };
    try{
      const route = await routesController.createRoute(request, routeOptions);
      route.name = 'Castellón-Valencia';
      route.geometry=null
      const savedRoute = await routesController.saveRoute(request, route);
    }catch(error){
      expect(error.message).toBe('Usuario no autentificado');
    }
  })
  it('(Válido): debería listar la ruta', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
    const request = {
      user: registered,
    };
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };
    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.geometry=null
    const savedRoute = await routesController.saveRoute(request, route);
    expect(savedRoute.userId).toBe(registered.id)
    const routes = await routesController.getRoutesOfUser(request);

    expect(routes.length).toBe(1);
    expect(routes[0].id).toBe(savedRoute.id);

  })
  it('(Inválido): debería lanzar la excepción user not logged', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
    const request = {
    };

    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };
    try{
      const route = await routesController.createRoute(request, routeOptions);
      route.name = 'Castellón-Valencia';
      route.geometry=null
      const savedRoute = await routesController.saveRoute(request, route);
      expect(savedRoute.userId).toBe(registered.id)
      const routes = await routesController.getRoutesOfUser(request);
    }catch(error){
      expect(error.message).toBe('Usuario no autentificado');
    }
  })
  it('(Válido): debería borrar la ruta', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
    const request = {
      user: registered,
    };
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.geometry=null
    const savedRoute = await routesController.saveRoute(request, route);

    const deleted = await routesController.deleteVehicle(request, savedRoute.id);

    expect(deleted.message).toBe('Ruta eliminada')
  })
  it('(Inválido): debería lanzar la excepción de ruta no existe', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();
    

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
    const request = {
      user: registered,
    };

    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.geometry=null
    const savedRoute = await routesController.saveRoute(request, route);

    try{
      const deleted = await routesController.deleteVehicle(request, 7);
      fail('Se esperaba que lanzara la excepción InvalidVehicleException');
    }catch(error){
      expect(error.message).toBe('La ruta no existe')
    }    
  })
  it('(Válido): debería añadir la ruta a favorito', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
    const request = {
      user: registered,
    };

    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.geometry=null
    let savedRoute = await routesController.saveRoute(request, route);
    
    savedRoute.fav = true;

    const updatedRoute = await routesController.addFavouriteRoute(savedRoute, request)

    expect(updatedRoute.fav).toBe(true)
  });
  
  it('(Inválido): debería saltar que la ruta no existe', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
    const request = {
      user: registered,
    };
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.fav = true;

    try{
      const updatedRoute = await routesController.addFavouriteRoute(route, request);
      fail('Se esperaba que lanzara la excepción InvalidVehicleException');
    }catch(error){
      expect(error.message).toBe('La ruta no existe')
    }
  })
  it('(Válido): debería quitar la ruta a favorito', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
    const request = {
      user: registered,
    };

    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.geometry=null
    route.fav = true;
    let savedRoute = await routesController.saveRoute(request, route);
    
    savedRoute.fav = false;

    const updatedRoute = await routesController.addFavouriteRoute(savedRoute, request)

    expect(updatedRoute.fav).toBe(false)
  })
  it('(Inválido): debería saltar que la ruta no existe', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
    const request = {
      user: registered,
    };
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.fav = false;

    try{
      const updatedRoute = await routesController.addFavouriteRoute(route, request);
      fail('Se esperaba que lanzara la excepción InvalidVehicleException');
    }catch(error){
      expect(error.message).toBe('La ruta no existe')
    }
  })

  it('(Válido): debería calcular el coste medio de calorias quemadas para una ruta', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();
    
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

    //Creamos una ruta y la guardamos al usuario
    
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request,  routeOptions);
    route.name = 'UJI-Estación';
    route.geometry=null
    const routeSaved = await routesController.saveRoute(request, route);
    const routes = await routesController.getRoutesOfUser(request);

    //Creamos la clase que se encarga de hacer el cálculo del coste calorico
    const costeCalorico = new CaloriesCost();
    const calorias = await costeCalorico.calcularCoste(null, routeSaved);

    //Comprobar resultado
    expect(calorias).toBeGreaterThan(0);
  })
  
  it('(Inválido): debería saltar que el tipo de vehiculo es incorrecto', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();

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
      carbType: CarbType.Gasolina_95_E5,
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    await vehicleController.addVehicle(request, vehicleDto);

    const response = await vehicleController.getVehicleOfUser(request);

    const vehicle = response[0];
    
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'UJI-Estación';
    route.geometry=null
    const routeSaved = await routesController.saveRoute(request, route);
    const routes = await routesController.getRoutesOfUser(request);

    //Creamos la clase que se encarga de hacer el cálculo del coste calorico
    const costeCalorico = new CaloriesCost();
    try {
      const calorias = await costeCalorico.calcularCoste(vehicle, routeSaved);
      fail('Se esperaba que lanzara la excepción InvalidTypeVehicleException');
    } catch (error) {
      expect(error.message).toBe('InvalidTypeVehicleException');
      expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    }
  })
  
  it('(Válido): debería calcular el coste asociado a una ruta para un vehículo eléctrico', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();
    
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
      carbType: CarbType.Electric,
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    await vehicleController.addVehicle(request, vehicleDto);

    const response = await vehicleController.getVehicleOfUser(request);

    const vehicle = response[0];

    //Creamos una ruta y la guardamos al usuario
    
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.geometry=null
    const routeSaved = await routesController.saveRoute(request, route);
    const routes = await routesController.getRoutesOfUser(request);
    
    //Creamos la clase que se encarga de hacer el cálculo del coste electrico
    const costeElectrico = new ElectricCost();
    const precio = await costeElectrico.calcularCoste(vehicle, routeSaved);

    //Comprobar resultado
    expect(precio).toBeLessThan(10);
    expect(precio).toBeGreaterThanOrEqual(0.1);
  })
  
  it('(Inválido): debería saltar que el tipo de coche es incorrecto', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();
    
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
      carbType: CarbType.Biodiesel,
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    await vehicleController.addVehicle(request, vehicleDto);

    const response = await vehicleController.getVehicleOfUser(request);

    const vehicle = response[0];

    //Creamos una ruta y la guardamos al usuario
    
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.geometry=null
    const routeSaved = await routesController.saveRoute(request, route);
    const routes = await routesController.getRoutesOfUser(request);
    
    //Creamos la clase que se encarga de hacer el cálculo del coste electrico
    const costeElectrico = new ElectricCost();
    try {
      const precio = await costeElectrico.calcularCoste(vehicle, routeSaved);
      fail('Se esperaba que lanzara la excepción InvalidVehicleException');
    } catch (error) {
      expect(error.message).toBe('InvalidTypeVehicleException');
    }
  })
  it('(Válido): debería calcular el coste asociado a una ruta para un vehículo de carburante', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();
    
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
      carbType: CarbType.Gasoleo_A,
      model: 'X',
      consum: 8,
      brand: 'Una',
      fav: false,
    };

    await vehicleController.addVehicle(request, vehicleDto);

    const response = await vehicleController.getVehicleOfUser(request);

    const vehicle = response[0];

    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.geometry=null
    const routeSaved = await routesController.saveRoute(request, route);
    const routes = await routesController.getRoutesOfUser(request);
    
    //Creamos la clase que se encarga de hacer el cálculo del coste electrico
    const costeCombustible = new FuelCost();
    const precio = await costeCombustible.calcularCoste(vehicle, routeSaved);

    //Comprobar resultado
    expect(precio).toBeLessThan(15); //No se cuanto poner de minimo ni de maximo 
    expect(precio).toBeGreaterThanOrEqual(0.1);
  })
  
  it('(Inválido): debería saltar que el tipo de coche es incorrecto', async () => {
    //await userService.clearDatabase();
    //await placesService.clearDatabase();
    //await vehicleService.clearDatabase();
    //await routesService.clearDatabase();
    
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
      carbType: CarbType.Electric,
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    await vehicleController.addVehicle(request, vehicleDto);

    const response = await vehicleController.getVehicleOfUser(request);

    const vehicle = response[0];

    //Creamos una ruta y la guardamos al usuario
    
    const routeOptions: RouteOptionsDto = {
      startLon: '-0.0576800',
      startLat: '39.9929000',
      endLon: '-0.3773900',
      endLat: '39.4697500',
      vehicleType: VehicleType.DRIVING_CAR,
      strategy: Strategy.RECOMMENDED
    };

    const route = await routesController.createRoute(request, routeOptions);
    route.name = 'Castellón-Valencia';
    route.geometry=null
    const routeSaved = await routesController.saveRoute(request, route);
    const routes = await routesController.getRoutesOfUser(request);
    
    //Creamos la clase que se encarga de hacer el cálculo del coste electrico
    const costeCombustible = new FuelCost();
    try {
      const precio = await costeCombustible.calcularCoste(vehicle, routeSaved);
      fail('Se esperaba que lanzara la excepción InvalidVehicleException');
    } catch (error) {
      expect(error.message).toBe('InvalidTypeVehicleException');
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    }
  })
  
  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await userService.clearDatabase();
    await placesService.clearDatabase();
    await vehicleService.clearDatabase();
    await routesService.clearDatabase();
  });
});
