import { Route } from "entities/route.entity";
import { Vehicle } from "entities/vehicle.entity";
import { RoutesController } from "../routes.controller";
import { RoutesService } from "../routes.service";
import { Repository } from 'typeorm';
import { VehicleController } from "modules/vehicle/vehicle.controller";
import { VehicleService } from "modules/vehicle/vehicle.service";

export abstract class AbstractCost {
    private readonly routesRepository: Repository<Route>;
    private readonly vehicleRepository: Repository<Vehicle>;
    private routeController: RoutesController;
    private routeService: RoutesService;
    private vehicleController: VehicleController;
    private vehicleService: VehicleService;

    constructor() {
        this.routeService = new RoutesService(this.routesRepository);
        this.routeController = new RoutesController(this.routeService); //¿Creamos un controller nuevo o se lo pasamos como argumento?
        this.vehicleService = new VehicleService(this.vehicleRepository);
        this.vehicleController = new VehicleController(this.vehicleService);
    }

    calcularCoste(vehicle: Vehicle, route: Route): Promise<number> {
        const distance = this.getDistance(route);
        const list = this.getConsum(vehicle);
        const type = list[0];
        const consum = list[1];
        const precio = this.getPrice(type, consum, distance);
        return precio;
    }

    getDistance(route: Route): Promise<number> {
        return this.routeController.getDistance(route);
    }

    getConsum(vehicle: Vehicle): Promise<string> {
        if (vehicle == null) {
            return Promise.resolve("walk");
        } else {
            return this.vehicleController.getVehicleType(vehicle);
        }
    }

    abstract getPrice(type: string, consum: number, distance: number): Promise<number>;
}