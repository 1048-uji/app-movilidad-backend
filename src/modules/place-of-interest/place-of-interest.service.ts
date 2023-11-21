import { Injectable } from '@nestjs/common';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { User } from '../../entities/user.entity';
import { PlaceOfinterestDto } from './dto/placeOfInterest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class PlaceOfInterestService {
  constructor(
    @InjectRepository(PlaceOfInterest) private readonly poiRepository: Repository<PlaceOfInterest>
) {}
  private readonly apiKey = '5b3ce3597851110001cf62482f02da5ed6794ccc8c6774ab019ffc8d';
  private readonly baseUrlOR = "https://api.openrouteservice.org/"

  async addPlaceOfInterestCoords(placeOfInterestdata: PlaceOfinterestDto, user: User): Promise<PlaceOfInterest> {
    try {
      const geocodingResponse = await axios.get('https://api.openrouteservice.org/geocode/reverse?api_key='+this.apiKey+'&point.lon='+placeOfInterestdata.lon+'&point.lat='+placeOfInterestdata.lat
        /*this.baseUrlOR+"geocode/reverse", {
        params: {
          api_key: this.apiKey,
          'point.lon': placeOfInterestdata.lon,
          'point.lat': placeOfInterestdata.lat,
        },
      }*/);
      const poiExist = await this.poiRepository.findOneBy({
        lat: placeOfInterestdata.lat,
        lon: placeOfInterestdata.lon,
      });
      if (poiExist) {
          throw new HttpException('Place of Interest already exists', HttpStatus.CONFLICT);
      }
      placeOfInterestdata.userId = user.id;
      return this.poiRepository.save(placeOfInterestdata);
    } catch (error) {
      //console.log(error)
      throw new HttpException('APIFailed', HttpStatus.SERVICE_UNAVAILABLE);
    }

    
  }

  async getPlacesOfInterest(): Promise<PlaceOfInterest[]> {
    return this.poiRepository.find();
  }

  async clearDatabase(){
    this.poiRepository.clear();
  }
}