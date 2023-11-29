/*import { RegisterDto } from 'modules/auth/dto/register.dto';
import { User } from '../entities/user.entity';
import { PlaceOfInterest } from 'entities/placeOfInterest.entity';

export class UserRepositoryMock {
  private  users: User[] = [];

  
  async save(registerObject: RegisterDto): Promise<User> {
    if (!registerObject.email) {
      throw new Error('El objeto de registro debe contener un email válido.');
    }

    const newUser: User = {
        id: this.users.length + 1,
        email: registerObject.email,
        username: registerObject.username,
        password: registerObject.password,
        placesOfInterest: [],
    };
    this.users.push(newUser);
    return newUser;
    }
    createQueryBuilder(alias?: string, queryRunner?: import("typeorm").QueryRunner): import("typeorm").SelectQueryBuilder<User> {
        // Puedes personalizar la implementación según tus necesidades
        return {
          select: (fields: string[]) => this.select(fields),
          getMany: async () => this.getMany(),
        } as any;
      }
      private select(fields: string[]): UserRepositoryMock {
        const selectedFields = fields.filter(field => ['id', 'email', 'username'].includes(field));

    // Asignar los campos seleccionados a cada usuario
    this.users.forEach(user => {
      Object.keys(user).forEach(key => {
        if (!selectedFields.includes(key)) {
          delete user[key];
        }
      });
    });

    return this;
      }
    
      private async getMany(): Promise<User[]> {
        // Implementa la lógica para devolver usuarios (puedes personalizar según tus necesidades)
        return this.users;
      }
  async findOne(emailToFind: string): Promise<User | null> {
    const users = await this.users.find(user => user.email === emailToFind)
    
    // Devuelve el primer usuario encontrado o undefined si no hay ninguno
    return users ? users : null;
  }
  async findOneBy(emailToFind: string): Promise<User | null> {
    //const users = await this.users.find(user => user.email === emailToFind)
    // Devuelve el usuario encontrado o null si no hay ninguno
    //console.log(users)
    return this.users[0];
  }

  async findOneById(idToFind: number): Promise<User | null> {
    console.log('ID a encontrar: ', idToFind);
    const user = this.users.find(user => user.id === idToFind);
    // Devuelve el usuario encontrado o null si no hay ninguno
    return user || null;
  }
  async remove(user: User): Promise<void> {
    const index = this.users.findIndex(user => user.id === user.id);
  if (index !== -1) {
    this.users.splice(index, 1);
  }
  }
  async clear(): Promise<void> {

    this.users = [];

  }
}*/