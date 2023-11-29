import { Controller, Get, Post, UseGuards, Request, Body, Param, Delete } from '@nestjs/common/decorators';
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

  @Post('/place-of-interest/:toponym')
  @ApiParam({ name: 'toponym', type: String })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('strategy_jwt_1'))
  async addPlaceOfInteresToponym(
    @Request() req: any,
    @Param('toponym') toponym: string): Promise<PlaceOfInterest> {
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
    @Delete(':id')
    @ApiParam({ name: 'id', type: Number })
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async deletePlaceOfInterest(@Request() req: any,
    @Param('id', ParseIntPipe) id: number): Promise<String> {
        return this.poiService.deletePlaceOfInterest(id, req.user);
    }
}