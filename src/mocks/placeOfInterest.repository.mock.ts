/*import { User } from '../entities/user.entity';
import { PlaceOfInterest } from 'entities/placeOfInterest.entity';
import { PlaceOfinterestDto } from 'modules/place-of-interest/dto/placeOfInterest.dto';

export class PlaceOfInterestRepositoryMock {
  private  placeOfInterests: PlaceOfInterest[] = [];

  
  async save(registerObject: PlaceOfinterestDto): Promise<PlaceOfInterest> {
    const newPOI: PlaceOfInterest = {
        id: this.placeOfInterests.length + 1,
        name: registerObject.name,
        lat: registerObject.lat,
        lon: registerObject.lon,
        fav: registerObject.fav,
        userId: registerObject.userId,
        user: new User(),
    };
    this.placeOfInterests.push(newPOI);
    return newPOI;
    }

    async findOneBy(lat: string, lon: string): Promise<PlaceOfInterest | null> {
        //const users = await this.users.find(user => user.email === emailToFind)
        // Devuelve el usuario encontrado o null si no hay ninguno
        //console.log(users)
        return this.placeOfInterests[0];
      }
    async find(): Promise<PlaceOfInterest[]> {
      //const users = await this.users.find(user => user.email === emailToFind)
      // Devuelve el usuario encontrado o null si no hay ninguno
      //console.log(users)
      return this.placeOfInterests;
    }
    async findBy(id: number): Promise<PlaceOfInterest[]>{
      //const places = await this.placeOfInterests.find(placeOfInterest => placeOfInterest.userId === id);
      return this.placeOfInterests;
    }

      createQueryBuilder(alias?: string): any {
        return {
          select: (fields: string[]) => this.select(fields),
          getMany: async () => this.getMany(),
        } as any;
      }
    
      // Método para seleccionar campos específicos
      private select(fields: string[]): PlaceOfInterestRepositoryMock {
        const selectedFields = fields.filter((field) =>
          ['id', 'name', 'lat', 'lon', 'userId'].includes(field)
        );
    
        // Asignar los campos seleccionados a cada lugar de interés
        this.placeOfInterests.forEach((placeOfInterest) => {
          Object.keys(placeOfInterest).forEach((key) => {
            if (!selectedFields.includes(key)) {
              delete placeOfInterest[key];
            }
          });
        });
    
        return this;
      }
    
      // Método para obtener todos los lugares de interés
      private getMany(): PlaceOfInterest[] {
        return this.placeOfInterests;
      }

  async clear(): Promise<void> {

    this.placeOfInterests = [];

  }
}*/