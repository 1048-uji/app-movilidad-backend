import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenRoutesService from '../../apis/openroutes';
import { Route } from '../../entities/route.entity';
import { Repository } from 'typeorm';
import { RouteDto } from './dto/route.dto';
import { RouteOptionsDto } from './dto/routeOptions.dto';
import { PlaceOfinterestDto } from '../place-of-interest/dto/placeOfInterest.dto';
import { User } from '../../entities/user.entity';
import { AbstractCost } from './template-method/abstract-cost';
import { CarbType, Vehicle } from '../../entities/vehicle.entity';
import { availableParallelism } from 'os';
import { ElectricCost } from './template-method/electric-cost';
import { CaloriesCost } from './template-method/calories-cost';
import { FuelCost } from './template-method/fuel-cost';

@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(Route) private readonly routesRepository: Repository<Route>,
        @InjectRepository(Vehicle) private readonly vehicleRepository: Repository<Vehicle>
    ) {}
    private openRoutesApi = OpenRoutesService.getInstance();
    private abstractCost: AbstractCost

    async createRoute(routeOptions: RouteOptionsDto): Promise<RouteDto> {
        let start: PlaceOfinterestDto = new PlaceOfinterestDto();
        let end: PlaceOfinterestDto = new PlaceOfinterestDto();
        start.lat = routeOptions.startLat;
        start.lon  = routeOptions.startLon;
        start.address = routeOptions.startAddress;
        end.lat = routeOptions.endLat;
        end.lon  = routeOptions.endLon;
        end.address = routeOptions.endAddress;
        if ((start.lat === (null||undefined) && start.lon === (null||undefined))){
            if(start.address === (null||undefined)){
                throw new HttpException('La direccion de origen debe tener coordenadas o una dirección', HttpStatus.BAD_REQUEST);
            }else{
                start = await this.openRoutesApi.getCoordinatesByAddress(start)
            }
            
        }
        if ((end.lat === (null||undefined) && end.lon === (null||undefined))){
            if( end.address === (null||undefined)){
                throw new HttpException('La direccion de destino debe tener coordenadas o una dirección', HttpStatus.BAD_REQUEST);
            }else{
                 end = await this.openRoutesApi.getCoordinatesByAddress(end)
            }            
        }
        const route = await this.openRoutesApi.createRoute(start, end, routeOptions);
        //console.log(route.geometry);
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
        if (route && route.userId === user.id){
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

    async deleteRoute(id: number, user: User): Promise<{message: string}>{
        const route = await this.routesRepository.findOneBy({id: id});

        if (!route) {
            throw new HttpException('La ruta no existe', HttpStatus.NOT_FOUND);
        }

        if (route.userId !== user.id){
          throw new HttpException('La ruta no es tuya', HttpStatus.UNAUTHORIZED);
        }

        await this.routesRepository.remove(route);
        return {message: 'Ruta eliminada'};
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

    async getDistance(route: Route): Promise<number> {
        return parseFloat(route.distance);
    }

    async priceOfRoute(idVehicle: number, routeData: RouteDto, user: User): Promise<number> {
        const vehicle = await this.vehicleRepository.findOneBy({id: idVehicle})
        if (vehicle.userId != user.id){
            throw new HttpException('No eres el propietario del vehiculo', HttpStatus.UNAUTHORIZED);
        }
        switch(vehicle.carbType) { 
            case CarbType.Electric: { 
               this.abstractCost = new ElectricCost() 
               break; 
            } 
            case CarbType.Calories: { 
              this.abstractCost = new CaloriesCost()
               break; 
            } default: { 
              this.abstractCost = new FuelCost()
              break; 
            }
          } 
        return await this.abstractCost.getPrice(vehicle.carbType, vehicle.consum, parseFloat(routeData.distance), routeData.start)
    }

  async clearDatabase(){
    this.routesRepository.delete({});
  }
}
