import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { HttpStatus } from '@nestjs/common';
import { PlaceOfinterestDto } from './dto/placeOfInterest.dto';
import { User } from '../../entities/user.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../users/user.service';
import { AuthController } from '../auth/auth.controller';
import { RegisterDto } from 'modules/auth/dto/register.dto';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/strategy/jwt.constant';
import { Vehicle } from '../../entities/vehicle.entity';
import { ConfigModule } from '@nestjs/config';
import { Route } from '../../entities/route.entity';

describe('PlacesOfInterestController (Alta Lugar de Interés - Válido)', () => {
  let placesController: PlaceOfInterestController;
  let placesService: PlaceOfInterestService;
  let userService: UserService;
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

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
        TypeOrmModule.forFeature([User, PlaceOfInterest]),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '30d' },
        }),
      ],
      controllers: [PlaceOfInterestController, AuthController],
      providers: [PlaceOfInterestService,
                  UserService,
                  AuthService,],
    }).compile();

    placesController = module.get<PlaceOfInterestController>(PlaceOfInterestController);
    placesService = module.get<PlaceOfInterestService>(PlaceOfInterestService);
    userService = module.get<UserService>(UserService);
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('debería dar de alta un lugar de interés válido', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();
    await placesService.clearDatabase();

    // Coordenadas para el nuevo lugar de interés
    const poi: PlaceOfinterestDto = {
      name: 'UJI',
      lon: '-0.0576800',
      lat: '39.9929000',
      fav: true,
      userId: 0,
    }
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = await authController.register(user);

    const request = {
      user: registered,
    };

    // Añadir un lugar de interés
    await placesController.addPlaceOfInterestCoords(request, poi);

    // Verificar que el lugar de interés se ha añadido correctamente
    const placesOfInterest: PlaceOfInterest[] = await placesService.getPlacesOfInterest();
    expect(placesOfInterest).toHaveLength(1);
  });

  it('debería lanzar una excepción si se intenta añadir un lugar de interés con coordenadas incorrectas', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();
    await placesService.clearDatabase();
    const poi: PlaceOfinterestDto = {
      name: 'UJI',
      lat: '',
      lon: '',
      fav: true,
      userId: 0,
    }
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = await authController.register(user);

    const request = {
      user: registered,
    };
    // Intentar añadir un lugar de interés con coordenadas incorrectas
    try {
      await placesController.addPlaceOfInterestCoords(request, poi);
      // Si no lanza una excepción, la prueba falla
      fail('Se esperaba que lanzara una excepción');
    } catch (error) {
      // Verificar que la excepción sea la esperada
      expect(error.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    }
  });
  it('Crea un nuevo punto de interés con un topónimo válido', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();
    await placesService.clearDatabase();

    // Toponimo para el nuevo lugar de interes
    const place: PlaceOfinterestDto = {
      name: 'Castellón',
      address: 'Castellón',
    };
    
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = await authController.register(user);

    const request = {
      user: registered,
    };

    // Añadir un lugar de interés
    await placesController.addPlaceOfInteresAddress(request, place);

    // Verificar que el lugar de interés se ha añadido correctamente
    const placesOfInterest: PlaceOfInterest[] = await placesService.getPlacesOfInterest();
    expect(placesOfInterest).toHaveLength(1);
  });

  it('debería lanzar una excepción si se intenta añadir un lugar de interés con un topónimo incorrecto', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();
    await placesService.clearDatabase();

    // Toponimo para el nuevo lugar de interes
    const place: PlaceOfinterestDto = {
      name: 'Casa',
      address: '',
    }

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = await authController.register(user);

    const request = {
      user: registered,
    };

    // Realizar la solicitud para añadir un nuevo punto de interés
    try {
      // Añadir un lugar de interés incorrecto
      await placesController.addPlaceOfInteresAddress(request, place);
    } catch (error) {
      // Verificar que se haya lanzado un error con el mensaje esperado
      expect(error.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    }
  });

  it('debería devolver la lista de lugares de interés del usuario autentificado', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();
    await placesService.clearDatabase();
  
    // Crear un usuario autentificado
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    
    const registered = await authController.register(user);
  
    // Añadir lugares de interés para el usuario
    const poi: PlaceOfinterestDto = {
      name: 'UJI',
      lon: '-0.0576800',
      lat: '39.9929000',
      fav: true,
      userId: 0,
    }
    const request = {
      user: registered
    };
    
    // Realizar la solicitud para añadir un nuevo lugar de interés

    await placesController.addPlaceOfInterestCoords(request, poi);

    // Consultar la lista de lugares de interés del usuario
    const response = await placesController.getPlacesOfInterestOfUser(request);
  
    // Verificar que la respuesta contenga los lugares de interés esperados
    expect(response).toHaveLength(1);
    expect(response[0].lat).toEqual(poi.lat);
    expect(response[0].lon).toEqual(poi.lon);
    });
  
    //Escenario 2
    it('debería lanzar DataBaseInaccessibleException si la base de datos no está disponible', async () => {

      await userService.clearDatabase();
      await placesService.clearDatabase();
      // Crear un usuario autentificado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      // Intentar consultar la lista de lugares de interés
      try {
        await placesController.getPlacesOfInterestOfUser({user: registered});
      } catch (error) {
        // Verificar que la excepción lanzada sea DataBaseInaccessibleException
        expect(error.message).toBe('DataBaseInaccessibleException');
      }
    });
    it('debería borrar un lugar de interés guardado y guardar el cambio en el servidor', async () => {
      // Limpiar la base de datos antes de la prueba
      await userService.clearDatabase();
      await placesService.clearDatabase();
    
      // Crear un usuario autentificado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      // Añadir lugares de interés para el usuario
      const placeOfInterest1: PlaceOfinterestDto = {
        name: 'Castellón',
        lon: '-0.0576800',
        lat: '39.9929000',
        fav: true,
        userId: registered.id,
      };
      const placeOfInterest2: PlaceOfinterestDto = {
        name: 'Benicasim',
        lon: '0.0633400',
        lat: '40.0528000',
        fav: true,
        userId: registered.id,
      };
    
      const request = {
        user: registered,
      };
    
      // Realizar la solicitud para añadir nuevos lugares de interés
      const poi1 = await placesController.addPlaceOfInterestCoords(request, placeOfInterest1);
      const poi2 = await placesController.addPlaceOfInterestCoords(request, placeOfInterest2);
    
      // Consultar la lista de lugares de interés del usuario para verificar que se han añadido correctamente
      let placesOfInterest = await placesController.getPlacesOfInterestOfUser(request);
      expect(placesOfInterest).toHaveLength(2);
    
      // Realizar la solicitud para borrar un lugar de interés
      await placesController.deletePlaceOfInterest(request, poi1.id);
    
      // Consultar la lista de lugares de interés del usuario después de borrar uno
      placesOfInterest = await placesController.getPlacesOfInterestOfUser(request);
    
      // Verificar que solo queda un lugar de interés después de borrar uno
      expect(placesOfInterest).toHaveLength(1);
      expect(placesOfInterest[0]).toEqual(poi2);
    });
    it('debería lanzar la excepción NullPointerException al intentar borrar un lugar de interés inexistente', async () => {
      // Limpiar la base de datos antes de la prueba
      await userService.clearDatabase();
      await placesService.clearDatabase();
    
      // Crear un usuario autentificado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      const request = {
        user: registered,
      };
    
      // Intentar borrar un lugar de interés que no existe
      try {
        await placesController.deletePlaceOfInterest(request, 1);
        // Si no lanza una excepción, la prueba falla
        fail('Se esperaba que lanzara la excepción NullPointerException');
      } catch (error) {
        // Verificar que la excepción sea la esperada
        expect(error.message).toBe('PlaceOfInterestNotExist');
      }
    });

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await userService.clearDatabase();
    await placesService.clearDatabase();
  });

  it('E01 (Válido): debería añadir el punto de interes a favorito', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();

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
   
    const poi = await placesController.addPlaceOfInterestCoords(request, start);

    poi.fav = true;

    const updatePoi = await placesController.addFavoritePoi(poi, request);

    expect(updatePoi.fav).toBe(true);
  })

  it('E02 (inválido): debería saltar que el punto de interes no existe', async () => {
    userService.clearDatabase();
    placesService.clearDatabase();

    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'tP386161',
    };
    const registered = await authController.register(user);
    const request = {
      user: registered,
    };

    const user2: RegisterDto = {
      email: 'al386162@uji.es',
      username: 'José Antonia',
      password: 'tP386162',
    };
    const registered2 = await authController.register(user2);
    const request2 = {
      user2: registered2,
    };

    const start: PlaceOfinterestDto = 
      { name: 'Castellón',
        lon: '-0.0576800', 
        lat: '39.9929000', 
        fav: false };
   
    const poi = await placesController.addPlaceOfInterestCoords(request, start);
    poi.fav = true;

    try {
      await placesController.addFavoritePoi(poi, request2);
      fail('Se esperaba que lanzara la excepcion No eres el propietario del punto de interes');
    } catch(error) {
      expect(error.message).toBe('No eres el propietario del punto de interes');
    }
  })
});