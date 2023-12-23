import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { VehicleDto } from './dto/vehicle.dto';
import { User } from '../../entities/user.entity';
import { fail } from 'assert';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../users/user.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/strategy/jwt.constant';
import { Vehicle } from '../../entities/vehicle.entity';
import { HttpStatus } from '@nestjs/common';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { ConfigModule } from '@nestjs/config';
import { Route } from '../../entities/route.entity';

describe('VehicleController (Registro de Vehículos)', () => {
  let vehicleController: VehicleController;
  let vehicleService: VehicleService;
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
        TypeOrmModule.forFeature([Vehicle, PlaceOfInterest, Vehicle, Route]),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '30d' },
        }),
      ],
      controllers: [VehicleController, AuthController],
      providers: [VehicleService, UserService, AuthService],
    }).compile();

    vehicleController = module.get<VehicleController>(VehicleController);
    vehicleService = module.get<VehicleService>(VehicleService);
    userService = module.get<UserService>(UserService);
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('debería registrar un vehículo válido', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();

    // Crear un usuario registrado
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = await authController.register(user);

    // Datos para el nuevo vehículo
    const vehicleDto: VehicleDto = {
      registration: '1234ABC',
      name: 'coche',
      carbType: 'gasolina',
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    const request = {
      user: registered,
    };

    // Registrar el vehículo
    const vehicle = await vehicleController.addVehicle(request, vehicleDto);

    expect(vehicle.registration).toBe(vehicleDto.registration)
  });

  it('debería lanzar una excepción si la base de datos no está disponible al intentar registrar un vehículo', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();

    // Crear un usuario registrado
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    const registered = await authController.register(user);

    const request = {
      user: registered,
    };
    // Intentar registrar un vehículo cuando la base de datos no está disponible
    try {
      const vehicleDto: VehicleDto = {
        registration: '1234ABC',
        name: 'coche',
        carbType: 'gasolina',
        model: 'X',
        consum: 15,
        brand: 'Una',
        fav: false,
      };
      await vehicleController.addVehicle(request, vehicleDto);
      // Si no lanza una excepción, la prueba falla
      fail('Se esperaba que lanzara la excepción DataBaseInaccessibleException');
    } catch (error) {
      // Verificar que la excepción sea la esperada
      expect(error.message).toBe('DataBaseInaccessibleException');
    }
  });

  it('debería eliminar el vehiculo de un usuario autenticado', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();

    // Crear un usuario en la base de datos
    const user: RegisterDto = {
      username: 'José Antonio',
      email: 'al386161@uji.es',
      password: 'Tp386161',
    };
    const registered = await authService.register(user);

    // Autenticar al usuario
    const authenticatedUser = await authController.login({
      email: 'al386161@uji.es',
      password: 'Tp386161',
    });
    const request = {
      user: registered,
    };

    // Datos para el nuevo vehículo
    const vehicleDto: VehicleDto = {
      registration: '1234ABC',
      name: 'coche',
      carbType: 'gasolina',
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    // Registrar el vehículo
    const vehicle = await vehicleController.addVehicle(request, vehicleDto);

    // Borrar el vehiculo del usuario autenticado
    await vehicleController.deleteVehicle(request, vehicle.id);

    // Verificar que el vehiculo se borró correctamente
    const vehicleRegistrados = await vehicleService.getVehiclesOfUser(registered.id);
    expect(vehicleRegistrados).toHaveLength(0);
  });

  it('debería lanzar una excepción si se intenta borrar un vehiculo que no existe', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();

    // Crear un usuario en la base de datos
    const user: RegisterDto = {
      username: 'José Antonio',
      email: 'al386161@uji.es',
      password: 'Tp386161',
    };
    const registered = await authService.register(user);

    // Autenticar al usuario
    const authenticatedUser = await authController.login({
      email: 'al386161@uji.es',
      password: 'Tp386161',
    });
    const request = {
      user: registered,
    };

    // Datos para el nuevo vehículo
    const vehicleDto: VehicleDto = {
      registration: '1234ABC',
      name: 'coche',
      carbType: 'gasolina',
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    // Registrar el vehículo
    const vehicle = await vehicleController.addVehicle(request, vehicleDto);

    // Intentar borrar un vehiculo de un usuario que no existe
    try {
      await vehicleController.deleteVehicle(request, 10);
      // Si no lanza una excepción, la prueba falla
      fail('Se esperaba que lanzara una excepción');
    } catch (error) {
      // Verificar que la excepción sea la esperada
      expect(error.status).toBe(HttpStatus.NOT_FOUND);
      expect(error.message).toBe('VehicleNotExist');
    }
  });

  it('debería devolver la lista de vehiculos del usuario autentificado', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();
  
    // Crear un usuario autentificado
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    
    const registered = await authController.register(user);
  
    // Añadir vehiculo para el usuario
    const vehicleDto: VehicleDto = {
      registration: '1234ABC',
      name: 'coche',
      carbType: 'gasolina',
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    const request = {
      user: registered
    };
    
    // Realizar la solicitud para añadir un nuevo vehiculo

    await vehicleController.addVehicle(request, vehicleDto);

    // Consultar la lista de vehiculos del usuario
    const response = await vehicleController.getVehicleOfUser(request);
  
    // Verificar que la respuesta contenga los lugares de interés esperados
    expect(response).toHaveLength(1);
    expect(response[0].name).toEqual(vehicleDto.name);
    expect(response[0].registration).toEqual(vehicleDto.registration);
    });
  
    //Escenario 2
    it('debería lanzar DataBaseInaccessibleException si la base de datos no está disponible', async () => {
      await userService.clearDatabase();
      // Crear un usuario autentificado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      // Intentar consultar la lista de vehiculos
      try {
        jest.spyOn(vehicleService, 'getVehiclesOfUser').mockRejectedValue(new Error('DataBaseInaccessibleException'));
        await vehicleController.getVehicleOfUser({user: registered});
      } catch (error) {
        // Verificar que la excepción lanzada sea DataBaseInaccessibleException
        expect(error.message).toBe('DataBaseInaccessibleException');
      }
    });

  it('debería devolver la lista de vehiculos del usuario autentificado', async () => {
    // Limpiar la base de datos antes de la prueba
    await userService.clearDatabase();
  
    // Crear un usuario autentificado
    const user: RegisterDto = {
      email: 'al386161@uji.es',
      username: 'José Antonio',
      password: 'Tp386161',
    };
    
    const registered = await authController.register(user);
  
    // Añadir vehiculo para el usuario
    const vehicleDto: VehicleDto = {
      registration: '1234ABC',
      name: 'coche',
      carbType: 'gasolina',
      model: 'X',
      consum: 15,
      brand: 'Una',
      fav: false,
    };

    const request = {
      user: registered
    };
    
    // Realizar la solicitud para añadir un nuevo vehiculo

    await vehicleController.addVehicle(request, vehicleDto);

    // Consultar la lista de vehiculos del usuario
    const response = await vehicleController.getVehicleOfUser(request);
  
    // Verificar que la respuesta contenga los lugares de interés esperados
    expect(response).toHaveLength(1);
    expect(response[0].name).toEqual(vehicleDto.name);
    expect(response[0].registration).toEqual(vehicleDto.registration);
    });
  
    //Escenario 2
    it('debería lanzar DataBaseInaccessibleException si la base de datos no está disponible', async () => {
      await userService.clearDatabase();
      // Crear un usuario autentificado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      // Intentar consultar la lista de vehiculos
      try {
        jest.spyOn(vehicleService, 'getVehiclesOfUser').mockRejectedValue(new Error('DataBaseInaccessibleException'));
        await vehicleController.getVehicleOfUser({user: registered});
      } catch (error) {
        // Verificar que la excepción lanzada sea DataBaseInaccessibleException
        expect(error.message).toBe('DataBaseInaccessibleException');
      }
    });
    it('debería actualizar el tipo y consumo de un vehículo existente', async () => {
      // Limpiar la base de datos antes de la prueba
      await userService.clearDatabase();
    
      // Crear un usuario autenticado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      // Añadir vehículos para el usuario
      const vehicle: VehicleDto = 
        {
          name: 'vehículo1',
          carbType: 'combustible',
          registration: '1234HSC',
          model: 'X',
          consum: 5,
          brand: 'Una',
          fav: false,
        }
      const request = {
        user: registered,
      };

      const vehicleAdded = await vehicleController.addVehicle(request, vehicle);
      
    
      // Actualizar el tipo y consumo del vehículo1
      const updatedVehicleDto: VehicleDto = {
        id: vehicleAdded.id,
        registration:'1234ABC',
        name: 'vehículo1',
        carbType: 'electrico',
        model: 'X',
        consum: 20,
        brand: 'Una',
        fav: false,
      };
    
      // Realizar la solicitud para actualizar el vehículo
      const updatedVehicle = await vehicleController.updateVehicle(updatedVehicleDto, request);
    
      // Obtener el vehículo actualizado
    
      // Verificar que el vehículo se actualizó correctamente
      expect(updatedVehicle.carbType).toEqual(updatedVehicleDto.carbType);
      expect(updatedVehicle.consum).toEqual(updatedVehicleDto.consum);
      expect(updatedVehicle.registration).toEqual(updatedVehicleDto.registration);
    });
    it('debería lanzar una excepción si se intenta actualizar un vehículo inexistente', async () => {
      // Limpiar la base de datos antes de la prueba
      await userService.clearDatabase();
    
      // Crear un usuario autenticado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      const request = {
        user: registered,
      };
    
      // Intentar actualizar un vehículo que no existe
      try {
        const updatedVehicleDto: VehicleDto = {
          name: 'vehículo1',
          registration: '1234ABC',
          carbType: 'electrico',
          model: 'X',
          consum: 20,
          brand: 'Una',
          fav: false,
        };
        await vehicleController.updateVehicle(updatedVehicleDto, request);
        // Si no lanza una excepción, la prueba falla
        fail('Se esperaba que lanzara una excepción');
      } catch (error) {
        // Verificar que la excepción sea la esperada
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('Vehicle does not exist');
      }
    });
    it('debería añadir a favoritos un vehículo existente', async () => {
      // Limpiar la base de datos antes de la prueba
      await userService.clearDatabase();
    
      // Crear un usuario autenticado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      // Añadir vehículos para el usuario
      const vehicle: VehicleDto = 
        {
          name: 'vehículo1',
          carbType: 'combustible',
          registration: '1234HSC',
          model: 'X',
          consum: 5,
          brand: 'Una',
          fav: false,
        }
      const request = {
        user: registered,
      };

      const vehicleAdded = await vehicleController.addVehicle(request, vehicle);
      
    
      // Actualizar el tipo y consumo del vehículo1
      const updatedVehicleDto: VehicleDto = {
        id: vehicleAdded.id,
        name: 'vehículo1',
        carbType: 'combustible',
        registration: '1234HSC',
        model: 'X',
        consum: 5,
        brand: 'Una',
        fav: true,
      };
    
      // Realizar la solicitud para actualizar el vehículo
      const updatedVehicle = await vehicleController.updateVehicle(updatedVehicleDto, request);
    
      // Obtener el vehículo actualizado
    
      // Verificar que el vehículo se actualizó correctamente
      expect(updatedVehicle.fav).toEqual(updatedVehicleDto.fav);
    });
    it('debería lanzar una excepción si se intenta actualizar un vehículo inexistente', async () => {
      // Limpiar la base de datos antes de la prueba
      await userService.clearDatabase();
    
      // Crear un usuario autenticado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      const request = {
        user: registered,
      };
    
      // Intentar actualizar un vehículo que no existe
      try {
        const updatedVehicleDto: VehicleDto = {
          name: 'vehículo1',
          registration: '1234ABC',
          carbType: 'electrico',
          model: 'X',
          consum: 20,
          brand: 'Una',
          fav: true,
        };
        await vehicleController.updateVehicle(updatedVehicleDto, request);
        // Si no lanza una excepción, la prueba falla
        fail('Se esperaba que lanzara una excepción');
      } catch (error) {
        // Verificar que la excepción sea la esperada
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('Vehicle does not exist');
      }
    });
    it('debería añadir a favoritos un vehículo existente', async () => {
      // Limpiar la base de datos antes de la prueba
      await userService.clearDatabase();
    
      // Crear un usuario autenticado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      // Añadir vehículos para el usuario
      const vehicle: VehicleDto = 
        {
          name: 'vehículo1',
          carbType: 'combustible',
          registration: '1234HSC',
          model: 'X',
          consum: 5,
          brand: 'Una',
          fav: true,
        }
      const request = {
        user: registered,
      };

      const vehicleAdded = await vehicleController.addVehicle(request, vehicle);
      
    
      // Actualizar el tipo y consumo del vehículo1
      const updatedVehicleDto: VehicleDto = {
        id: vehicleAdded.id,
        name: 'vehículo1',
        carbType: 'combustible',
        registration: '1234HSC',
        model: 'X',
        consum: 5,
        brand: 'Una',
        fav: false,
      };
    
      // Realizar la solicitud para actualizar el vehículo
      const updatedVehicle = await vehicleController.updateVehicle(updatedVehicleDto, request);
    
      // Obtener el vehículo actualizado
    
      // Verificar que el vehículo se actualizó correctamente
      expect(updatedVehicle.fav).toEqual(updatedVehicleDto.fav);
    });
    it('debería lanzar una excepción si se intenta actualizar un vehículo inexistente', async () => {
      // Limpiar la base de datos antes de la prueba
      await userService.clearDatabase();
    
      // Crear un usuario autenticado
      const user: RegisterDto = {
        email: 'al386161@uji.es',
        username: 'José Antonio',
        password: 'Tp386161',
      };
      const registered = await authController.register(user);
    
      const request = {
        user: registered,
      };
    
      // Intentar actualizar un vehículo que no existe
      try {
        const updatedVehicleDto: VehicleDto = {
          name: 'vehículo1',
          registration: '1234ABC',
          carbType: 'electrico',
          model: 'X',
          consum: 20,
          brand: 'Una',
          fav: false,
        };
        await vehicleController.updateVehicle(updatedVehicleDto, request);
        // Si no lanza una excepción, la prueba falla
        fail('Se esperaba que lanzara una excepción');
      } catch (error) {
        // Verificar que la excepción sea la esperada
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('Vehicle does not exist');
      }
    });

  // Limpiar la base de datos después de cada prueba si es necesario
  afterEach(async () => {
    await userService.clearDatabase();
  });
});
