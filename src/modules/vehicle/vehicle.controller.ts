import { Body, Controller, Delete, Param, ParseIntPipe, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
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

  @Delete(':id')
    @ApiParam({ name: 'id', type: Number })
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async deletePlaceOfInterest(@Request() req: any,
    @Param('id', ParseIntPipe) id: number): Promise<String> {
        return this.vehicleService.deleteVehicle(id, req.user);
    }
}
