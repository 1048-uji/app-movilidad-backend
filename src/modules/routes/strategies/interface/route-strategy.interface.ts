import { Route } from 'entities/route.entity';
import { PlaceOfinterestDto } from 'modules/place-of-interest/dto/placeOfInterest.dto';
import { RouteDto } from 'modules/routes/dto/route.dto';
import { RouteOptionsDto } from 'modules/routes/dto/routeOptions.dto';

export interface RouteStrategy {
  createRoute(start: PlaceOfinterestDto, end: PlaceOfinterestDto, type: RouteOptionsDto): Promise<RouteDto>;
}