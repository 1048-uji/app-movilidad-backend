import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { HttpStatus } from '@nestjs/common';

describe('PlacesOfInterestController (Alta Lugar de Interés - Válido)', () => {
  let placesController: PlaceOfInterestController;
  let placesService: PlaceOfInterestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceOfInterestController],
      providers: [PlaceOfInterestService],
    }).compile();

    placesController = module.get<PlaceOfInterestController>(PlaceOfInterestController);
    placesService = module.get<PlaceOfInterestService>(PlaceOfInterestService);
  });

  it('debería dar de alta un lugar de interés válido', async () => {
    // Limpiar la base de datos antes de la prueba
    await placesService.clearDatabase();

    // Coordenadas para el nuevo lugar de interés
    const coordinates = '-0.0576800,39.9929000';

    // Añadir un lugar de interés
    await placesController.addPlaceOfInterestCoords(coordinates);

    // Verificar que el lugar de interés se ha añadido correctamente
    const placesOfInterest: PlaceOfInterest[] = await placesService.getPlacesOfInterest();
    expect(placesOfInterest).toHaveLength(1);
    expect(placesOfInterest[0]).toEqual({
      name: 'Castellon',
      coordinates: coordinates,
      favorite: false,
    });
  });

  it('debería lanzar una excepción si se intenta añadir un lugar de interés con coordenadas incorrectas', async () => {
    // Limpiar la base de datos antes de la prueba
    await placesService.clearDatabase();

    // Intentar añadir un lugar de interés con coordenadas incorrectas
    try {
      await placesController.addPlaceOfInterestCoords('');
      // Si no lanza una excepción, la prueba falla
      fail('Se esperaba que lanzara una excepción');
    } catch (error) {
      // Verificar que la excepción sea la esperada
      expect(error.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(error.message).toBe('InvalidCoordinatesException');
    }
  });

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await placesService.clearDatabase();
  });
});