import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlaceOfInterest } from './placeOfInterest.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    email: string;
    @Column()
    username: string;
    @Column({length: 50})
    password: string;
    @OneToMany(() => PlaceOfInterest, placeOfInterest => placeOfInterest.user)
    placesOfInterest: PlaceOfInterest[];

}