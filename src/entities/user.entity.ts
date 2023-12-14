import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PlaceOfInterest } from './placeOfInterest.entity';
import { Vehicle } from './vehicle.entity';
import { Route } from './route.entity';
import { Strategy } from '../modules/routes/dto/routeOptions.dto';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    email: string;
    @Column()
    username: string;
    @Column()
    password: string;
    @OneToMany(() => PlaceOfInterest, placeOfInterest => placeOfInterest.user)
    placesOfInterest?: PlaceOfInterest[];
    @OneToMany(() => Vehicle, vehicle => vehicle.user)
    vehicle?: Vehicle[];    
    @OneToOne(() => Vehicle, {nullable: true})
    @JoinColumn()
    vehicleDefault: Vehicle;
    @Column({default: Strategy.RECOMMENDED})
    routeDefault?: Strategy
    @OneToMany(() => Route, route => route.user)
    routes?: Route[];   

}