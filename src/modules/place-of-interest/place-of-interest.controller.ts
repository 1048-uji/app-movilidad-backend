import { Controller, Get, Post, UseGuards, Request, Body, Param, Delete, Put } from '@nestjs/common/decorators';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { PlaceOfinterestDto } from './dto/placeOfInterest.dto';

@Controller('place-of-interest')
@ApiTags('Place-of-interest')
export class PlaceOfInterestController {
  constructor(private poiService: PlaceOfInterestService) {}

  @Post('/coords')
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

  @Get('/coords/{lat}/{lng}')
  @ApiParam({ name: 'lat', type: String })
  @ApiParam({ name: 'lng', type: String })
  @ApiBearerAuth()
  async getPlaceOfInterestCoords(
    @Param('lat') lat: string,
    @Param('lng') lng: string
  ): Promise<{lat: string, lng:string, address: string}> {
      return this.poiService.getPlaceOfInterestCoords(lat, lng);
  }

  @Post('/address')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('strategy_jwt_1'))
  async addPlaceOfInteresAddress(
    @Request() req: any,
    @Body(
      new ValidationPipe({
          transform: true,
          transformOptions: { enableImplicitConversion: true },
          forbidNonWhitelisted: true
      })
  )
  placeOfInterstData: PlaceOfinterestDto): Promise<PlaceOfInterest> {
        return this.poiService.addPlaceOfInteresAddress(placeOfInterstData, req.user);
  }
  
  @Get('/place-of-interest')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('strategy_jwt_1'))
  async getPlacesOfInterestOfUser(
    @Request() req: any,
      ): Promise<PlaceOfInterest[]> {
        return this.poiService.getPlacesOfInterestOfUser(req.user.id);
  }
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('strategy_jwt_1'))
  async deletePlaceOfInterest(@Request() req: any,
  @Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
      return this.poiService.deletePlaceOfInterest(id, req.user);
  }

  @Put('/addFav')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async addFavoritePoi(
        @Body(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true
            })
        )
        poiData: PlaceOfinterestDto,
        @Request() req: any
    ): Promise<PlaceOfInterest> {
        return this.poiService.updatePoi(poiData, req.user);
    }

    @Put('/deleteFav')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async deleteFavoritePoi(
        @Body(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true
            })
        )
        poiData: PlaceOfinterestDto,
        @Request() req: any
    ): Promise<PlaceOfInterest> {
        return this.poiService.updatePoi(poiData, req.user);
    }
}