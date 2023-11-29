import { Body, Controller, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Vehicle } from '../../entities/vehicle.entity';
import { VehicleService } from './vehicle.service';
import { VehicleDto } from './dto/vehicle.dto';

@Controller('vehicle')
@ApiTags('Vehicle')
export class VehicleController {
    constructor(private vehicleService: VehicleService) {}

  @Post('/vehicle')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('strategy_jwt_1'))
  async addVehicle(
      @Request() req: any,
      @Body(
          new ValidationPipe({
              transform: true,
              transformOptions: { enableImplicitConversion: true },
              forbidNonWhitelisted: true
          })
      )
      vehicleData: VehicleDto
  ): Promise<Vehicle> {
      return this.vehicleService.addVehicle(vehicleData, req.user);
  }

}
