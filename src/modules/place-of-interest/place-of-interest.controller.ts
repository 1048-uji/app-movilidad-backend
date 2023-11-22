import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { PlaceOfinterestDto } from './dto/placeOfInterest.dto';
import { User } from '../../entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from '@nestjs/common';

@Controller('place-of-interest')
export class PlaceOfInterestController {
  constructor(private poiService: PlaceOfInterestService) {}

  @Post('/place-of-interest')
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
}