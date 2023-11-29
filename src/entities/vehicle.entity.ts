import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./user.entity";


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
    carbType: string;
    @Column()
    consum: number;
    @Column({default: false})
    fav: boolean;
    @Column({nullable: true})
    userId?: number;
    @ManyToOne(() => User, user => user.vehicle)
    user: User;

}