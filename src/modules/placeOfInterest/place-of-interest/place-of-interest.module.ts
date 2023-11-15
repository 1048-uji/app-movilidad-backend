import { Module } from '@nestjs/common';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule], // Si se necesita conexión a la base de datos
  controllers: [PlaceOfInterestController],
  providers: [PlaceOfInterestService],
})
export class PlaceOfInterestModule {}
