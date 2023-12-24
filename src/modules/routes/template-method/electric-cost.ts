import { CarbType, Vehicle } from "entities/vehicle.entity";
import { AbstractCost } from "./abstract-cost";
import { HttpException, HttpStatus } from "@nestjs/common";
import axios from "axios";
export class ElectricCost extends AbstractCost {
    async getPrice(type: string, consum: number, distance: number, start: string): Promise<number> {
        if (type === CarbType.Electric) {
            try {
                const baseUrlLuz = 'https://api.preciodelaluz.org/v1/prices/avg?zone=PCB';
                const response = await axios.get(baseUrlLuz);
                const price = response.data.price;
                const realPrice = price / 1000;
                const realDistance = distance / 1000 / 100;
                return realDistance * consum * realPrice;
            } catch (error) {
                throw new HttpException('APINotWorkingException', HttpStatus.BAD_GATEWAY);
            }
        } else {
            throw new HttpException('InvalidTypeVehicleException', HttpStatus.UNAUTHORIZED);
        }
    }
}