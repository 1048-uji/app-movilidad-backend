import { Module } from '@nestjs/common';
import { PlaceOfInterestModule } from './modules/place-of-interest/place-of-interest.module';

@Module({
  imports: [PlaceOfInterestModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
