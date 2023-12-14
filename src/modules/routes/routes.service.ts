import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenRoutesService from '../../apis/openroutes';
import { Route } from '../../entities/route.entity';
import { Repository } from 'typeorm';
import { RouteDto } from './dto/route.dto';
import { RouteOptionsDto } from './dto/routeOptions.dto';
import { PlaceOfinterestDto } from '../place-of-interest/dto/placeOfInterest.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(Route) private readonly routesRepository: Repository<Route>
    ) {}
    private openRoutesApi = OpenRoutesService.getInstance();

    async createRoute(start: PlaceOfinterestDto, end: PlaceOfinterestDto, routeOptions: RouteOptionsDto): Promise<RouteDto> {
        if ((start.lat === (null||undefined) && start.lon === (null||undefined)) && start.address === (null||undefined)){
            throw new HttpException('La direccion de origen debe tener coordenadas o una dirección', HttpStatus.BAD_REQUEST);
        }
        if ((end.lat === (null||undefined) && end.lon === (null||undefined)) && end.address === (null||undefined)){
            throw new HttpException('La direccion de destino debe tener coordenadas o una dirección', HttpStatus.BAD_REQUEST);
        }
        const route = await this.openRoutesApi.createRoute(start, end, routeOptions);
        return route;
    }
    async saveRoute(user: User, routeData: RouteDto): Promise<Route>{
        if(user === (null||undefined)){
            throw new HttpException('Usuario no autentificado', HttpStatus.UNAUTHORIZED);
        }
        const route = await this.routesRepository.findOneBy({
            start: routeData.start,
            end: routeData.end,
            userId: user.id,
          });
        if (route){
            throw new HttpException('La ruta ya existe', HttpStatus.FOUND)
        }
        routeData.userId = user.id
        return await this.routesRepository.save(routeData);
    }
    async getRoutesOfUser(user: User): Promise<Route[]>{
        if(user === (null||undefined)){
            throw new HttpException('Usuario no autentificado', HttpStatus.UNAUTHORIZED);
        }
        return await this.routesRepository.findBy({userId: user.id});
    }

    async deleteRoute(id: number, user: User): Promise<String>{
        const route = await this.routesRepository.findOneBy({id: id});

        if (!route) {
            throw new HttpException('La ruta no existe', HttpStatus.NOT_FOUND);
        }

        if (route.userId !== user.id){
          throw new HttpException('La ruta no es tuya', HttpStatus.UNAUTHORIZED);
        }

        await this.routesRepository.remove(route);
        return 'Ruta eliminada';
    }

    async updateRoute(routeData: RouteDto, user: any): Promise<Route> {
        const route = await this.routesRepository.findOneBy({ id: routeData.id });
        if (!route) {
            throw new HttpException('La ruta no existe', HttpStatus.NOT_FOUND);
        }
        if (route.userId != user.id) {
            throw new HttpException('No eres el propietario de la ruta', HttpStatus.UNAUTHORIZED);
        }
        return this.routesRepository.save(routeData);
    }

  async clearDatabase(){
    this.routesRepository.clear();
  }
}
