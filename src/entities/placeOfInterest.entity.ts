import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class PlaceOfInterest {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    lon: string;
    @Column()
    lat: string;
    @Column()
    address: string;    
    @Column({nullable: true})
    region: string;
    @Column({nullable: true})
    macroregion: string;
    @Column({nullable: true})
    localadmin: string;
    @Column()
    country: string;
    @Column({default: false})
    fav: boolean;
    @Column({nullable: true})
    userId?: number;
    @ManyToOne(() => User, user => user.placesOfInterest, { onDelete: 'CASCADE' , onUpdate: 'CASCADE'})
    user?: User;

}