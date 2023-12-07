import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlaceOfInterest } from './placeOfInterest.entity';
import { Vehicle } from './vehicle.entity';

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


}