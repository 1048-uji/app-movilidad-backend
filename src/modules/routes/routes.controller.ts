import { Body, Controller, Post, UseGuards, ValidationPipe, Request, Get, Delete, Param, ParseIntPipe, Put } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RouteDto } from './dto/route.dto';
import { RouteOptionsDto } from './dto/routeOptions.dto';
import { PlaceOfinterestDto } from '../place-of-interest/dto/placeOfInterest.dto';
import { Route } from '../../entities/route.entity';

@Controller('routes')
@ApiTags('Routes')
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
    @Get('/myroutes')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async getRoutesOfUser(
        @Request() req: any,
        ): Promise<Route[]> {
            return this.routesService.getRoutesOfUser(req.user);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: Number })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async deleteVehicle(@Request() req: any,
    @Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
        return this.routesService.deleteRoute(id, req.user);
    }

    @Put('/addFav')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async addFavouriteRoute(
        @Body(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true
            })
        )
        routeData: RouteDto,
        @Request() req: any
    ): Promise<Route> {
        return this.routesService.updateRoute(routeData, req.user);
    }

    @Put('/deleteFav')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async deleteFavouriteRoute(
        @Body(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true
            })
        )
        routeData: RouteDto,
        @Request() req: any
    ): Promise<Route> {
        return this.routesService.updateRoute(routeData, req.user);
    }

    @Get('Price/:vehicleId')
    @ApiParam({ name: 'vehicleId', type: Number })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async priceOfRoute(@Request() req: any,
    @Param('vehicleId', ParseIntPipe) vehicleId: number, 
    @Body(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            forbidNonWhitelisted: true
        })
    )
    routeData: RouteDto,): Promise<number> {
        return this.routesService.priceOfRoute(vehicleId, routeData, req.user);
    }
}
