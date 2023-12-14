import { Body, Controller, Post, UseGuards, ValidationPipe, Request, Get } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RouteDto } from './dto/route.dto';
import { RouteOptionsDto } from './dto/routeOptions.dto';
import { PlaceOfinterestDto } from '../place-of-interest/dto/placeOfInterest.dto';
import { Route } from '../../entities/route.entity';

@Controller('routes')
export class RoutesController {
    constructor(private routesService: RoutesService) {}

    @Get('/route')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async createRoute(
        @Request() req: any,
        @Body(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true
            })
        )
        startData: PlaceOfinterestDto,
        @Body(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true
            })
        )
        endData: PlaceOfinterestDto,
        @Body(
            new ValidationPipe({ 
                transform: true, 
                transformOptions: { enableImplicitConversion: true }, 
                forbidNonWhitelisted: true 
            })
            )
        routeOptions: RouteOptionsDto,
    ): Promise<RouteDto> {
        if (routeOptions.strategy == null){
            routeOptions.strategy = req.user.routeDefault
        }
        return this.routesService.createRoute(startData, endData, routeOptions);
    }
    @Post('/route')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async saveRoute(
        @Request() req: any,
        @Body(
            new ValidationPipe({ 
                transform: true, 
                transformOptions: { enableImplicitConversion: true }, 
                forbidNonWhitelisted: true 
            })
            )
        routeData: RouteDto,
    ): Promise<RouteDto> {
        return this.routesService.saveRoute(req.user, routeData);
    }
    @Get('/place-of-interest')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async getRoutesOfUser(
        @Request() req: any,
        ): Promise<Route[]> {
            return this.routesService.getRoutesOfUser(req.user);
    }
}
