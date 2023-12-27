import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { Vehicle } from '../../entities/vehicle.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Vehicle) private readonly vehicleRepository: Repository<Vehicle>
    ) {}
    async getUsers(): Promise<User[]>{
        return this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.email',])
        .getMany();
    }

    async deleteAccount(id: number): Promise<String>{
        const userExist = await this.userRepository.findOneBy({id: id});
  
        if (!userExist) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }

        await this.userRepository.remove(userExist);
        return 'Usuario eliminado';
    }

    async updateUser(userData: UserDto, user: User): Promise<User> {
        const userExist = await this.userRepository.findOneBy({ id: userData.id });
        if (!userExist) {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        if (userExist.id != user.id) {
            throw new HttpException('You are not the user', HttpStatus.UNAUTHORIZED);
        }
        if (userData.vehicleDefaultId){
            const vehicle = await this.vehicleRepository.findOneBy({ id: userData.vehicleDefaultId });
            if (!vehicle) {
                throw new HttpException('Vehicle does not exist', HttpStatus.NOT_FOUND);
            }
            if (vehicle.userId != user.id) {
                throw new HttpException('You are not the owner of this vehicle', HttpStatus.UNAUTHORIZED);
            }
            userData.vehicleDefault = vehicle
        }
        return this.userRepository.save(userData);
    }

    async clearDatabase(){
        await this.userRepository.delete({});
    }
}