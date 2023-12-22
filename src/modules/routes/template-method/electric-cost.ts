import { Vehicle } from "entities/vehicle.entity";
import { AbstractCost } from "./abstract-cost";
import { HttpException, HttpStatus } from "@nestjs/common";
import axios from "axios";
export class ElectricCost extends AbstractCost {
    async getPrice(type: string, consum: number, distance: number): Promise<number> {
        if (type != "electric") {
            throw new HttpException('InvalidTypeVehicleException', HttpStatus.UNAUTHORIZED);
        } else {
            try {
                const baseUrlLuz = 'https://api.preciodelaluz.org/v1/prices/avg?zone=PCB';
                const response = await axios.get(baseUrlLuz);
                const price = response.data.price;
                return (distance / 100) * consum * price;
            } catch (error) {
                throw new HttpException('APINotWorkingException', HttpStatus.BAD_GATEWAY);
            }
        }
    }
}