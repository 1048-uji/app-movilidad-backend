import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { User } from '../../entities/user.entity';
import { PlaceOfInterest } from 'src/entities/placeOfInterest.entity';
import { UserController } from '../users/user.controller';
import { UserService } from '../users/user.service';

describe('UsersController', () => {
  let piController: PlaceOfInterestController;
  let piService: PlaceOfInterestService;
  let usService: UserService;
  let usController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceOfInterestController],
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