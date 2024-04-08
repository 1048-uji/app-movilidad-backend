import { CarbType, Vehicle } from "../../../entities/vehicle.entity";
import { AbstractCost } from "./abstract-cost";
import { HttpException, HttpStatus } from "@nestjs/common";
import axios from "axios";
import OpenRoutesService from "../../../apis/openroutes";
import { PlaceOfinterestDto } from "../../place-of-interest/dto/placeOfInterest.dto";
export class FuelCost extends AbstractCost {
    private openRoutesApi = OpenRoutesService.getInstance();
    private baseUri = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/';
    async getPrice(type: string, consum: number, distance: number, start: string): Promise<number> {
        if (type === CarbType.Electric || type === CarbType.Calories) {
            throw new HttpException('InvalidTypeVehicleException', HttpStatus.BAD_REQUEST);
        } else {
            try {
                const coords: string[] = start.split(',')
                const poi: PlaceOfinterestDto = await this.openRoutesApi.getAddressByCoordinates({name: 'start', lon: coords[0], lat: coords[1]})
                if(poi.country != 'España'){
                    throw new HttpException('InvalidCountryException', HttpStatus.BAD_REQUEST);
                }
                const responseRegion = await axios.get(this.baseUri+'Listados/Provincias/')
                const regions: { ID: number; region: string }[] = responseRegion.data.map((region) => ({
                    ID: region.IDPovincia,
                    region: region.Provincia,
                  }));
                const regionFind = regions.find((region) => region.region.toLowerCase().includes(poi.region.toLowerCase()));
                const responseFuel = await axios.get(this.baseUri+'Listados/ProductosPetroliferos/')
                const fuels: { ID: number; nombre: string }[] = responseFuel.data.map((fuel) => ({
                    ID: fuel.IDProducto,
                    nombre: fuel.NombreProducto,
                  }));
                  
                const fuelFind = fuels.find((fuel) => fuel.nombre.toLowerCase() === type.toLowerCase());
                const responseStations = await axios.get(this.baseUri+'EstacionesTerrestres/FiltroProvinciaProducto/'+regionFind.ID+'/'+fuelFind.ID, {
                    headers: {
                      'Accept': 'application/json, img/png; charset=utf-8',
                      'Content-Type': 'application/json; charset=utf-8',
                    }
                  });
                  if (responseStations.data.ResultadoConsulta === 'OK' && responseStations.data.ListaEESSPrecio.length > 0) {
                    let nearest = null;
                    let shortestDistance = Infinity;
                    const startLat = parseFloat(coords[1].replace(',', '.'))
                    const startLon = parseFloat(coords[0].replace(',', '.'))
                
                    responseStations.data.ListaEESSPrecio.forEach((station) => {
                      const lat = parseFloat(station.Latitud.replace(',', '.'));
                      const lon = parseFloat(station['Longitud (WGS84)'].replace(',', '.'));
                
                      const distance = this.haversine(startLat, startLon, lat, lon);
                
                      if (distance < shortestDistance) {
                        shortestDistance = distance;
                        nearest = station;
                      }
                    });
                    return (distance / 100) * consum * parseFloat(nearest.PrecioProducto.replace(',', '.'));
                }else{
                  throw new HttpException('There is no such fuel type in the region of departure.', HttpStatus.NOT_FOUND);
                }                
            } catch (error) {
                throw new HttpException('APINotWorkingException', HttpStatus.BAD_GATEWAY);
            }
        }
    }
    haversine(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en kilómetros
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distancia en kilómetros
        return distance;
    }
}