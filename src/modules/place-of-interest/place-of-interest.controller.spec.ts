import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { User } from '../../entities/user.entity';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlaceOfInterestRepositoryMock } from '../../mocks/placeOfInterest.repository.mock';

describe('PuntosInteresController', () => {
  let controller: PlaceOfInterestController;
  let piService: PlaceOfInterestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceOfInterestController],
      providers: [PlaceOfInterestService,
        {
          provide: getRepositoryToken(PlaceOfInterest),
          useClass: PlaceOfInterestRepositoryMock,
        }],
    }).compile();

    controller = module.get<PlaceOfInterestController>(PlaceOfInterestController);
    piService = module.get<PlaceOfInterestService>(PlaceOfInterestService);
  });

  it('Crea un nuevo punto de interés con un topónimo válido', async () => {
    // Limpiar la base de datos antes de la prueba
    await piService.clearDatabase();

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
    await controller.addPlaceOfInteresToponym(request, toponym);

    // Verificar que el lugar de interés se ha añadido correctamente
    const placesOfInterest: PlaceOfInterest[] = await piService.getPlacesOfInterest();
    expect(placesOfInterest).toHaveLength(1);
  });

  it('debería lanzar una excepción si se intenta añadir un lugar de interés con un topónimo incorrecto', async () => {
    // Limpiar la base de datos antes de la prueba
    await piService.clearDatabase();

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
      await controller.addPlaceOfInteresToponym(request, toponym);
    } catch (error) {
      // Verificar que se haya lanzado un error con el mensaje esperado
      expect(error.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    }
  });
});
