import { CarbType } from "../../../entities/vehicle.entity";
import { AbstractCost } from "./abstract-cost";
import { HttpException, HttpStatus } from "@nestjs/common";

export class CaloriesCost extends AbstractCost {
    async getPrice(type: string, consum: number, distance: number, start: string): Promise<number> {
        if (type === CarbType.Calories) {
            const realDistance = distance;
            const velocidadMedia = 5; //km/h
            const tiempo = realDistance / velocidadMedia;
            const coste = tiempo * consum;
            return parseFloat(coste.toFixed(2));
        } else {
            throw new HttpException('InvalidTypeVehicleException', HttpStatus.UNAUTHORIZED);
        }
    }
}