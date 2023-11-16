import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

describe('PuntosInteresController', () => {
  let controller: PlaceOfInterestController;
  let piService: PlaceOfInterestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceOfInterestController],
      providers: [PlaceOfInterestService],
    }).compile();

    controller = module.get<PlaceOfInterestController>(PlaceOfInterestController);
    piService = module.get<PlaceOfInterestService>(PlaceOfInterestService);
  });

  it('Crea un nuevo punto de interés con un topónimo válido', async () => {
    const topónimo = 'Castellón';
    const coordenadas = '-0.0576800, 39.9929000';

    // Simular que la API de geocoding está disponible y devuelve las coordenadas
    jest.spyOn(piService, 'getCoordinatesFromAPI').mockResolvedValue(coordenadas);

    // Simular que la base de datos está disponible
    jest.spyOn(piService, 'savePointOfInterest').mockImplementation(async () => {
      return {
        id: 0,
        name: topónimo,
        coord: coordenadas,
        fav: false,
      };
    });

    // Realizar la solicitud para añadir un nuevo punto de interés
    await controller.addPlaceOfInterest(topónimo);

    // Verificar que se haya llamado a la función para obtener coordenadas con el topónimo correcto
    expect(piService.getCoordinatesFromAPI).toHaveBeenCalledWith(topónimo);

    // Verificar que se haya llamado a la función para guardar el punto de interés con los datos correctos
    expect(piService.savePointOfInterest).toHaveBeenCalledWith({
      name: topónimo,
      coord: coordenadas,
      fav: false,
    });

    // Verificar que el punto de interés se ha guardado en el servidor
    const puntosInteres = await piService.getAllPointsOfInterest();
    expect(puntosInteres).toHaveLength(1);
    expect(puntosInteres[0]).toEqual({
      name: topónimo,
      coord: coordenadas,
      fav: false,
    });
  });

  it('debería lanzar un error si la API de geocoding no está disponible', async () => {
    const topónimo = 'Castellón';

    // Simular que la API de geocoding no está disponible
    jest.spyOn(piService, 'getCoordinatesFromAPI').mockRejectedValue(new Error('GeocodingNotWorkingException'));

    // Realizar la solicitud para añadir un nuevo punto de interés
    try {
      await controller.addPlaceOfInterest(topónimo);
    } catch (error) {
      // Verificar que se haya lanzado un error con el mensaje esperado
      expect(error instanceof HttpException).toBe(true);
      expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.getResponse()).toBe('GeocodingNotWorkingException');
    }
  });

  afterEach(async () => {
    // Limpiar la base de datos después de cada prueba
    await piService.clearPointsOfInterest();
  });
});
