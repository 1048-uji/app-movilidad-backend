import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
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


    async clearDatabase(){
        await this.userRepository.delete({});
    }
}