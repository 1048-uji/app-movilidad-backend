import { Route } from "entities/route.entity";
import { Vehicle } from "entities/vehicle.entity";
import { RoutesController } from "../routes.controller";
import { RoutesService } from "../routes.service";

abstract class AbstractCost {
    calcularCoste(vehicle: Vehicle, route: Route): number {
        const distance = this.getDistance(route);
        const list = this.getConsum(vehicle);
        const type = list[0];
        const consum = list[1];
        return this.getPrice(type, consum, distance);
    }

    getDistance(route: Route): number {
        return //Referencia al controlardor de routas getDistance(route)
    }
    abstract getConsum(vehicle: Vehicle); //En este lo hacemos cada uno privado y comprobamos que sea del tipo que se quiere calcular ¿En caso de null sera andando o en bici?
    abstract getPrice(type: string, consum: number, distance: number);
}