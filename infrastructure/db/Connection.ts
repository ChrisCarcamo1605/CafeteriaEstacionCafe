import { DataSource } from "typeorm";
import { Bill } from "../../domain/entities/Bill";
import { Product } from "../../domain/entities/Producto";
import {BillDetails} from "../../domain/entities/BillDetails"

export const getDataSource = ()=>{
    return  new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5555,
    username: "admin",
    password: "estacionPass2025",
    database: "estacioncafedb",
    synchronize: true,
    logging: false,
    entities: [Bill,Product,BillDetails],
    migrations: [],
    subscribers: [],
  });
}

module.exports = {getDataSource}