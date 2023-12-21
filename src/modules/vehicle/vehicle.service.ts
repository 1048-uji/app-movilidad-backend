import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from '../../entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleDto } from './dto/vehicle.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(Vehicle) private readonly vehicleRepository: Repository<Vehicle>
    ) {}

    async addVehicle(vehicle: VehicleDto, user: User): Promise<Vehicle>{
        const vehicleExist = await this.vehicleRepository.findOneBy({
            userId: user.id,
            registration: vehicle.registration,
        });
        if (vehicleExist) {
            throw new HttpException('Vehicle already exists', HttpStatus.CONFLICT);
        }
        vehicle.userId = user.id;
        return this.vehicleRepository.save(vehicle);
    }

    async deleteVehicle(id: number, user: User): Promise<String>{
        const vehicle = await this.vehicleRepository.findOneBy({id: id});

        if (!vehicle) {
            throw new HttpException('VehicleNotExist', HttpStatus.NOT_FOUND);
        }

        if (vehicle.userId !== user.id){
          throw new HttpException('VehicleNotYours', HttpStatus.UNAUTHORIZED);
        }

        await this.vehicleRepository.remove(vehicle);
        return 'Vehicle eliminado';
    }
    
    async getVehiclesOfUser(id: number): Promise<Vehicle[]> {
        return this.vehicleRepository.findBy({userId: id});
      }

      async updateVehicle(vehicleData: VehicleDto, user: any): Promise<Vehicle> {
        const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleData.id });
        if (!vehicle) {
            throw new HttpException('Vehicle does not exist', HttpStatus.NOT_FOUND);
        }
        if (vehicle.userId != user.id) {
            throw new HttpException('You are not the owner of this vehicle', HttpStatus.UNAUTHORIZED);
        }
        return this.vehicleRepository.save(vehicleData);
    }
    
    getCarbTypeAndConsum(vehicle: Vehicle): Promise<[string, number]> {
        return Promise.resolve([vehicle.carbType, vehicle.consum]);
    }

    getVehicleType(vehicle: Vehicle): Promise<string> {
        return Promise.resolve(vehicle.carbType);
    }

    async clearDatabase(){
        this.vehicleRepository.clear();
      }

}
