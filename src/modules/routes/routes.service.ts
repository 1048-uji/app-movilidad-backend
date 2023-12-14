import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenRoutesService from '../../apis/openroutes';
import { Route } from '../../entities/route.entity';
import { Repository } from 'typeorm';
import { RouteDto } from './dto/route.dto';
import { RouteOptionsDto } from './dto/routeOptions.dto';
import { PlaceOfinterestDto } from 'modules/place-of-interest/dto/placeOfInterest.dto';

@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(Route) private readonly routesRepository: Repository<Route>
    ) {}
    private openRoutesApi = OpenRoutesService.getInstance();

    async createRoute(start: PlaceOfinterestDto, end: PlaceOfinterestDto, routeOptions: RouteOptionsDto): Promise<RouteDto> {
        if ((start.lat === (null||undefined) && start.lon === (null||undefined)) && start.address === (null||undefined)){
            throw new HttpException('Start point must have either lat and lon or address', HttpStatus.BAD_REQUEST);
        }
        if ((end.lat === (null||undefined) && end.lon === (null||undefined)) && end.address === (null||undefined)){
            throw new HttpException('End point must have either lat and lon or address', HttpStatus.BAD_REQUEST);
        }
        const route = await this.openRoutesApi.createRoute(start, end, routeOptions);
        return route;
  }

  async clearDatabase(){
    this.routesRepository.clear();
  }
}
