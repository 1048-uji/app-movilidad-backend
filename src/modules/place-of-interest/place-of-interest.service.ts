import { Injectable } from '@nestjs/common';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { User } from 'src/entities/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlaceOfInterestService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
) {}
  
  async getPlacesOfInterest(): Promise<PlaceOfInterest[]> {
    return this.poiRepository.find();
}

    async clearDatabase(){
        return this.userRepository.clear();
    }
}