import { Injectable } from '@nestjs/common';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { User } from '../../entities/user.entity';
import { PlaceOfinterestDto } from './dto/placeOfInterest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenRoutesService from '../../apis/openroutes';
import axios from 'axios';

@Injectable()
export class PlaceOfInterestService {
  constructor(
    @InjectRepository(PlaceOfInterest) private readonly poiRepository: Repository<PlaceOfInterest>
) {}
  private openRoutesApi = OpenRoutesService.getInstance();

  async addPlaceOfInterestCoords(placeOfInterestdata: PlaceOfinterestDto, user: User): Promise<PlaceOfInterest> {
        const poi = await this.openRoutesApi.getAddressByCoordinates(placeOfInterestdata);
        const poiExist = await this.poiRepository.findOneBy({
          lat: poi.lat,
          lon: poi.lon,
        });

        if (poiExist) {
          throw new HttpException('Place of Interest already exists', HttpStatus.CONFLICT);
        }
                
        poi.userId = user.id;
        return this.poiRepository.save(poi);
  }
  async addPlaceOfInteresToponym(toponym: string, user: User): Promise<PlaceOfInterest> {
      
        const poi = await this.openRoutesApi.getCoordinatesByAddress(toponym);
        const poiExist = await this.poiRepository.findOneBy({
          lat: poi.lat,
          lon: poi.lon,
        });

        if (poiExist) {
          throw new HttpException('Place of Interest already exists', HttpStatus.CONFLICT);
        }
                
        poi.userId = user.id;
        return this.poiRepository.save(poi);
  }

  async getPlacesOfInterest(): Promise<PlaceOfInterest[]> {
    return this.poiRepository.find();
  }

  async getPlacesOfInterestOfUser(id: number): Promise<PlaceOfInterest[]> {
    return this.poiRepository.findBy({userId: id});
  }
  async deletePlaceOfInterest(id: number, user: User): Promise<String>{
    const placeOfInterest = await this.poiRepository.findOneBy({id: id});

    if (!placeOfInterest) {
        throw new HttpException('PlaceOfInterestNotExist', HttpStatus.NOT_FOUND);
    }

    if (placeOfInterest.userId !== user.id){
      throw new HttpException('PlaceOfInterestNotYours', HttpStatus.UNAUTHORIZED);
    }

    await this.poiRepository.remove(placeOfInterest);
    return 'Place of Interest eliminado';
}

  async clearDatabase(){
    this.poiRepository.clear();
  }
}