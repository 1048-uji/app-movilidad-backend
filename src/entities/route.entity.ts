import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class Route {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string
    @Column({type: 'text'})
    path: string;
    @Column()
    distance: string;
    @Column()
    duration: string;
    @Column()
    start: string;
    @Column()
    end: string;
    @Column()
    geometry: string;
    @Column({default: false})
    fav: boolean;
    @Column({default: 'recommended'})
    type: string;
    @Column({nullable: true})
    userId?: number;
    @ManyToOne(() => User, user => user.routes, { onDelete: 'CASCADE' , onUpdate: 'CASCADE'})
    user: User;

}