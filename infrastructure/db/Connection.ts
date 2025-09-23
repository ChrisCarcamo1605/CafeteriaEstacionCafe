import "reflect-metadata";
import { DataSource } from "typeorm";
import { Bill } from "../../domain/Bill";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5555,
  username: "admin",
  password: "Carcamito*-*2024",
  database: "estacioncafedb",
  synchronize: true,
  logging: false,
  entities: [Bill],
  migrations: [],
  subscribers: [],
});

export const InizializeDataSource = () => {
  return AppDataSource.initialize().then(async (datasource) => {
    console.log("Conectando a la base de datos.");
    if (datasource) {
      console.log("Conexion Exitosa!");
      return await datasource;
    }
  });
};
