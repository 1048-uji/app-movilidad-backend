import { Vehicle } from "entities/vehicle.entity";
import { AbstractCost } from "./abstract-cost";
import { HttpException, HttpStatus } from "@nestjs/common";
class ElectricCost extends AbstractCost {
    getPrice(type: string, consum: number, distance: number): Promise<number> {
        if (type != "electric") {
            throw new HttpException('InvalidTypeVehicleException', HttpStatus.UNAUTHORIZED);
        } else {
            return //(distance / 100) * consum * llamar a la api de gasto electrico;
        }
    }
}