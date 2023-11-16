import { Module } from '@nestjs/common';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';

@Module({
  controllers: [PlaceOfInterestController],
  providers: [PlaceOfInterestService]
})
export class PlaceOfInterestModule {}
