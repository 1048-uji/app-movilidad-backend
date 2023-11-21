import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { HttpStatus } from '@nestjs/common';
import { PlaceOfinterestDto } from './dto/placeOfInterest.dto';
import { User } from '../../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlaceOfInterestRepositoryMock } from '../../mocks/placeOfInterest.repository.mock';

describe('PlacesOfInterestController (Alta Lugar de Interés - Válido)', () => {
  let placesController: PlaceOfInterestController;
  let placesService: PlaceOfInterestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceOfInterestController],
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

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await placesService.clearDatabase();
  });
});