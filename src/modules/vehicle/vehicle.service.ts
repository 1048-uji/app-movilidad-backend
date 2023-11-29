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

    async clearDatabase(){
        this.vehicleRepository.clear();
      }
}
