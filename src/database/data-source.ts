import { PlaceOfInterest } from "entities/placeOfInterest.entity";
import { User } from "entities/user.entity";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "roundhouse.proxy.rlwy.net",
    port: 26383,
    username: "root",
    password: "EFA4E3ehDbc-3BAb5DFFHHbf6feH5HH5",
    database: "railway",
    synchronize: true,
    logging: true,
    entities: ['src/entities/**.entity{.ts,.js}'],
    subscribers: ['src/subscriber/**/*{.ts,.js}'],
    migrations: ['src/database/migrations/**/*{.ts,.js}'],
})