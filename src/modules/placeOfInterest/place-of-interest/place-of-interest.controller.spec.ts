import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { HttpModule } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

describe('PlaceOfInterestController E01 (Válido)', () => {
  let controller: PlaceOfInterestController;
  let poiService: PlaceOfInterestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, DatabaseModule],
      controllers: [PlaceOfInterestController],
      providers: [PlaceOfInterestService],
    }).compile();

    controller = module.get<PlaceOfInterestController>(PlaceOfInterestController);
    poiService = module.get<PlaceOfInterestService>(PlaceOfInterestService);
  });

  it('Crea un lugar de interés cuando el topónimo es "Castellón"', async () => {
    // Given
    const topónimo = 'Castellón';

    // When
    const result = await controller.addPlaceOfInterest(topónimo);

    // Then
    expect(result).toBeDefined();
    expect(result.name).toBe('Castellon');
    expect(result.coord).toBe('-0.0576800, 39.9929000');
    expect(result.fav).toBe('false');

    const puntosInteres = await poiService.getAllPlacesOfInterest();
    expect(puntosInteres).toHaveLength(1);
    expect(puntosInteres[0]).toEqual(result);
  });

  afterAll(async () => {
    // Limpiar la base de datos después de las pruebas si es necesario
    await poiService.clearDatabase();
  });
});