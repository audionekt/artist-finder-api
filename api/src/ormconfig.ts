import { config } from "./config/index";

const ormconfig: any = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: config.database.admin,
  password: config.database.password,
  database: config.database.name,
  logging: true,
  entities: ["dist/models/*.entity{.ts,.js}"],
  seeds: ["dist/seeds/**/*.seeder{.ts,.js}"],
  factories: ["dist/factories/**/*.factory{.ts,.js}"],
  synchronize: true,
  cli: {
    entitiesDir: "src/models",
  },
};

export = ormconfig