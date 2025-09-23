"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InizializeDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Bill_1 = require("../../domain/Bill");
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5555,
    username: "admin",
    password: "Carcamito*-*2024",
    database: "estacioncafedb",
    synchronize: true,
    logging: false,
    entities: [Bill_1.Bill],
    migrations: [],
    subscribers: [],
});
const InizializeDataSource = () => {
    return AppDataSource.initialize().then((datasource) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Conectando a la base de datos.");
        if (datasource) {
            console.log("Conexion Exitosa!");
            return yield datasource;
        }
    }));
};
exports.InizializeDataSource = InizializeDataSource;
