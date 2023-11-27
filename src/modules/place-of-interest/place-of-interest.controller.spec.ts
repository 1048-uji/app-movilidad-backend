import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { HttpStatus } from '@nestjs/common';
import { PlaceOfinterestDto } from './dto/placeOfInterest.dto';
import { User } from '../../entities/user.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { PlaceOfInterestRepositoryMock } from '../../mocks/placeOfInterest.repository.mock';
import { UserService } from '../users/user.service';
import { AuthController } from '../auth/auth.controller';
import { RegisterDto } from 'modules/auth/dto/register.dto';
import { UserRepositoryMock } from '../../mocks/user.repository.mock';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/strategy/jwt.constant';

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
    await placesService.clearDatabase();

    // Coordenadas para el nuevo lugar de interés
    const poi: PlaceOfinterestDto = {
      name: 'UJI',
      lon: '-0.0576800',
      lat: '39.9929000',
      fav: true,
      userId: 0,
    }
    const user: User = {
      id: 1,
      email: "test@gmail.com",
      username: 'Antonio',
      password: "$2b$10$jH4RqkQWYGzOXNhZgVTK",
      placesOfInterest: []
    }
    const request = {
      user: user
    };

    // Añadir un lugar de interés
    await placesController.addPlaceOfInterestCoords(request, poi);

    // Verificar que el lugar de interés se ha añadido correctamente
    const placesOfInterest: PlaceOfInterest[] = await placesService.getPlacesOfInterest();
    expect(placesOfInterest).toHaveLength(1);
  });

  it('debería lanzar una excepción si se intenta añadir un lugar de interés con coordenadas incorrectas', async () => {
    // Limpiar la base de datos antes de la prueba
    await placesService.clearDatabase();
    const poi: PlaceOfinterestDto = {
      name: 'UJI',
      lat: '',
      lon: '',
      fav: true,
      userId: 0,
    }
    const user: User = {
      id: 1,
      email: "test@gmail.com",
      username: 'Antonio',
      password: "$2b$10$jH4RqkQWYGzOXNhZgVTK",
      placesOfInterest: []
    }
    const request = {
      user: user
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
    await placesService.clearDatabase();

    // Toponimo para el nuevo lugar de interes
    const toponym = 'Castellón';
    
    const user: User = {
      id: 0,
      email: "test@gmail.com",
      username: 'Antonio',
      password: "$2b$10$jH4RqkQWYGzOXNhZgVTK",
      placesOfInterest: []
    }

    const request = {
      user: user
    };

    // Añadir un lugar de interés
    await placesController.addPlaceOfInteresToponym(request, toponym);

    // Verificar que el lugar de interés se ha añadido correctamente
    const placesOfInterest: PlaceOfInterest[] = await placesService.getPlacesOfInterest();
    expect(placesOfInterest).toHaveLength(1);
  });

  it('debería lanzar una excepción si se intenta añadir un lugar de interés con un topónimo incorrecto', async () => {
    // Limpiar la base de datos antes de la prueba
    await placesService.clearDatabase();

    // Toponimo para el nuevo lugar de interes
    const toponym = '';

    const user: User = {
      id: 0,
      email: "test@gmail.com",
      username: 'Antonio',
      password: "$2b$10$jH4RqkQWYGzOXNhZgVTK",
      placesOfInterest: []
    }

    const request = {
      user: user
    };

    // Realizar la solicitud para añadir un nuevo punto de interés
    try {
      // Añadir un lugar de interés incorrecto
      await placesController.addPlaceOfInteresToponym(request, toponym);
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

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await placesService.clearDatabase();
  });
});