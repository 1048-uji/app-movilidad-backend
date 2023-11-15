import { Module } from '@nestjs/common';
import { PlaceOfInterestModule } from './modules/place-of-interest/place-of-interest.controller';
import { PlaceOfInterestService} from './modules/place-of-interest/place-of-interest.service';
import { PlaceOfInterestController } from './modules/place-of-interest/place-of-interest.controller';

@Module({
  imports: [PlaceOfInterestModule],
  controllers: [PlaceOfInterestController],
  providers: [PlaceOfInterestService],
})
export class AppModule {}
