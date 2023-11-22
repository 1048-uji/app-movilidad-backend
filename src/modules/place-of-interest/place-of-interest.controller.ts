import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common/decorators';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from '@nestjs/common';
import { PlaceOfinterestDto } from './dto/placeOfInterest.dto';

@Controller('place-of-interest')
export class PlaceOfInterestController {
  constructor(private poiService: PlaceOfInterestService) {}

  @Post('/place-of-interest/coords')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('strategy_jwt_1'))
  async addPlaceOfInterestCoords(
      @Request() req: any,
      @Body(
          new ValidationPipe({
              transform: true,
              transformOptions: { enableImplicitConversion: true },
              forbidNonWhitelisted: true
          })
      )
      placeOfInterstData: PlaceOfinterestDto
  ): Promise<PlaceOfInterest> {
      return this.poiService.addPlaceOfInterestCoords(placeOfInterstData, req.user);
  }

  @Post('/place-of-interest/toponym')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('strategy_jwt_1'))
  async addPlaceOfInteresToponym(
    @Request() req: any,
      @Body(
          new ValidationPipe({
              transform: true,
              transformOptions: { enableImplicitConversion: true },
              forbidNonWhitelisted: true
          })
      )
      toponym: string): Promise<PlaceOfInterest> {
        return this.poiService.addPlaceOfInteresToponym(toponym, req.user);
  }
  @Get('/place-of-interest')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('strategy_jwt_1'))
  async getPlacesOfInterestOfUser(
    @Request() req: any,
      ): Promise<PlaceOfInterest[]> {
        return this.poiService.getPlacesOfInterestOfUser(req.user.id);
  }
}