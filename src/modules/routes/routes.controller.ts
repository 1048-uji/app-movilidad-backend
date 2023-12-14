import { Body, Controller, Post, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RouteDto } from './dto/route.dto';
import { RouteOptionsDto } from './dto/routeOptions.dto';
import { PlaceOfinterestDto } from '../place-of-interest/dto/placeOfInterest.dto';

@Controller('routes')
export class RoutesController {
    constructor(private routesService: RoutesService) {}

    @Post('/route')
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
}
