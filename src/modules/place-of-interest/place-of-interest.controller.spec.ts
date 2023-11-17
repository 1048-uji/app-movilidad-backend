import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
<<<<<<< HEAD
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { HttpStatus } from '@nestjs/common';
import { PlaceOfinterestDto } from './dto/placeOfInterest.dto';
import { User } from '../../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlaceOfInterestRepositoryMock } from '../../mocks/placeOfInterest.repository.mock';

describe('PlacesOfInterestController (Alta Lugar de Interés - Válido)', () => {
  let placesController: PlaceOfInterestController;
  let placesService: PlaceOfInterestService;
=======
import { User } from '../../entities/user.entity';
import { PlaceOfInterest } from 'src/entities/placeOfInterest.entity';
import { UserController } from '../users/user.controller';
import { UserService } from '../users/user.service';

describe('UsersController', () => {
  let piController: PlaceOfInterestController;
  let piService: PlaceOfInterestService;
  let usService: UserService;
  let usController: UserController;
>>>>>>> 1c2106e (AcceptanceTests<HU07>: Invalid, Database not accesible complete)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceOfInterestController],
<<<<<<< HEAD
      providers: [PlaceOfInterestService,
        {
          provide: getRepositoryToken(PlaceOfInterest),
          useClass: PlaceOfInterestRepositoryMock,
        }],
    }).compile();

    placesController = module.get<PlaceOfInterestController>(PlaceOfInterestController);
    placesService = module.get<PlaceOfInterestService>(PlaceOfInterestService);
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

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await placesService.clearDatabase();
  });
});
=======
      providers: [PlaceOfInterestService],
    }).compile();

    piController = module.get<PlaceOfInterestController>(PlaceOfInterestController);
    piService = module.get<PlaceOfInterestService>(PlaceOfInterestService);

    const module2: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService],
      }).compile();

      usController = module2.get<UserController>(UserController);
      usService = module2.get<UserService>(UserService);
  });

  //Escenario 1
  it('debería devolver la lista de lugares de interés del usuario autentificado', async () => {
  // Limpiar la base de datos antes de la prueba
  await usService.clearDatabase();

  // Crear un usuario autentificado
  const user: User = {
    id: 1,
    email: 'al386161@uji.es',
    username: 'José Antonio',
    password: 'Tp386161',
  };
  
  await usService.registerUser(user);

  // Añadir lugares de interés para el usuario
  const place1: PlaceOfInterest = {
    id: 0,
    name: 'Castellón',
    coord: '-0.0576800,39.9929000',
    fav: false,
  }

  const place2: PlaceOfInterest = {
    id: 1,
    name: 'Benicasim',
    coord: '0.0633400,40.0528000',
    fav: false,
  }

  // Simular que la base de datos está disponible
  jest.spyOn(piService, 'addPlaceOfInterest').mockImplementation(async () => {
    return {
        id: 3,
        name: 'Valencia',
        coord: ' -0.3773900, 39.4697500',
        fav: false,
    };
  });

  // Consultar la lista de lugares de interés del usuario
  const response = await piService.getPlacesOfInterest();

  // Verificar que la respuesta contenga los lugares de interés esperados
  expect(response).toHaveLength(2);
  expect(response[0]).toEqual([place1]);
  expect(response[0]).toEqual([place2]);
  });

  //Escenario 2
  it('debería lanzar DataBaseInaccessibleException si la base de datos no está disponible', async () => {
  // Crear un usuario autentificado
  const user: User = {
    id: 1,
    email: 'al386161@uji.es',
    username: 'José Antonio',
    password: 'Tp386161',
  };
  await usService.registerUser(user);

  // Intentar consultar la lista de lugares de interés
  try {
    jest.spyOn(piService, 'getPlacesOfInterest').mockRejectedValue(new Error('DataBaseInaccessibleException'));
  } catch (error) {
    // Verificar que la excepción lanzada sea DataBaseInaccessibleException
    expect(error.getResponse()).toBe('DataBaseInaccessibleException');
  }
  });

  afterEach(async () => {
    // Limpiar la base de datos después de cada prueba
    await piService.clearPointsOfInterest();
  });
});
>>>>>>> 1c2106e (AcceptanceTests<HU07>: Invalid, Database not accesible complete)
