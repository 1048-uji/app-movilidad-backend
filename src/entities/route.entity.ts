import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Strategy } from "../modules/routes/dto/routeOptions.dto";


@Entity()
export class Route {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string
    @Column({type: 'text', nullable: true})
    path: string;
    @Column()
    distance: string;
    @Column()
    duration: string;
    @Column()
    start: string;
    @Column()
    end: string;
    @Column('simple-array', { nullable: true})
    geometry: string;
    @Column({default: false})
    fav: boolean;
    @Column({default: Strategy.RECOMMENDED})
    type: Strategy;
    @Column({nullable: true})
    userId?: number;
    @ManyToOne(() => User, user => user.routes, { onDelete: 'CASCADE' , onUpdate: 'CASCADE'})
    user: User;

}