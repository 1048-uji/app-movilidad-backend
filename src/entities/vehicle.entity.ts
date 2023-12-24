import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./user.entity";

export enum CarbType {
  Biodiesel = 'Biodiesel',
  Bioetanol = 'Bioetanol',
  Gas_Natural_Comprimido = 'Gas Natural Comprimido',
  Gas_Natural_Licuado = 'Gas Natural Licuado',
  Gases_licuados_del_petróleo = 'Gases licuados del petróleo',
  Gasoleo_A = 'Gasoleo A',
  Gasoleo_B = 'Gasoleo B',
  Gasoleo_Premium = 'Gasoleo Premium',
  Gasolina_95_E10 = 'Gasolina 95 E10',
  Gasolina_95_E5 = 'Gasolina 95 E5',
  Gasolina_95_E5_Premium = 'Gasolin 95 E5 Premium',
  Gasolina_98_E10 = 'Gasolina 98 E10',
  Gasolina_98_E5 = 'Gasolina 98 E5',
  Hidrogeno = 'Hidrogeno',
  Electric = 'Electric',
  Calories = 'Calories',
}
@Entity()
@Unique(['userId', 'registration'])
export class Vehicle {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    registration: string;
    @Column()
    brand: string;
    @Column({nullable: true})
    model: string;
    @Column()
    carbType: CarbType;
    @Column()
    consum: number;
    @Column({default: false})
    fav: boolean;
    @Column({nullable: true})
    userId?: number;
    @ManyToOne(() => User, user => user.vehicle, { onDelete: 'CASCADE' , onUpdate: 'CASCADE'})
    user: User;

}