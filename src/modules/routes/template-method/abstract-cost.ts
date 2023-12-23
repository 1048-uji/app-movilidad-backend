import { Route } from "entities/route.entity";
import { Vehicle } from "entities/vehicle.entity";
import { RoutesService } from "../routes.service";
import { Repository } from 'typeorm';
import { VehicleService } from "../../vehicle/vehicle.service";

export abstract class AbstractCost {
    private readonly routesRepository: Repository<Route>;
    private readonly vehicleRepository: Repository<Vehicle>;
    private routeService: RoutesService;
    private vehicleService: VehicleService;

    constructor() {
        this.routeService = new RoutesService(this.routesRepository);
        this.vehicleService = new VehicleService(this.vehicleRepository);
    }

    async calcularCoste(vehicle: Vehicle, route: Route): Promise<number> {
        const distance = await this.getDistance(route);
        const list = await this.getConsum(vehicle);
        const type = list[0];
        const consum = list[1];
        const precio = await this.getPrice(type, consum, distance, route.start);
        return precio;
    }

    async getDistance(route: Route): Promise<number> {
        return await this.routeService.getDistance(route);
    }

    async getConsum(vehicle: Vehicle): Promise<[string, number]> {
        if (vehicle == null) {
            return Promise.resolve(['walk',210]);
        } else {
            return await this.vehicleService.getCarbTypeAndConsum(vehicle);
        }
    }

    abstract getPrice(type: string, consum: number, distance: number, start: string): Promise<number>;
}