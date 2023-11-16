import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { PlaceOfInterest } from 'src/entities/placeOfInterest';

describe('UsersController', () => {
  let controller: UserController;
  let usService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    usService = module.get<UserService>(UserService);
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
    id: 0,
    name: 'Benicasim',
    coord: '0.0633400,40.0528000',
    fav: false,
  }
  await usService.addPlaceOfInterest(user, place1);
  await usService.addPlaceOfInterest(user, place2);

  // Consultar la lista de lugares de interés del usuario
  const response = await controller.getPlacesOfInterest(user);

  // Verificar que la respuesta contenga los lugares de interés esperados
  expect(response).toEqual([{ name: 'Castellón' }, { name: 'Benicasim' }]);
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
    await controller.getPlacesOfInterest(user);
  } catch (error) {
    // Verificar que la excepción lanzada sea DataBaseInaccessibleException
    expect(error).toBeInstanceOf('DataBaseInaccessibleException');
  }
  });
});
