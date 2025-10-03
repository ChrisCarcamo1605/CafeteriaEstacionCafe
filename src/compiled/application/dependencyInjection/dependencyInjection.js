"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDependencies = void 0;
const typeorm_1 = require("typeorm");
const Bill_1 = require("../../domain/entities/Bill");
const BillService_1 = require("../services/BillService");
const BillController_1 = require("../../controller/BillController");
const initializeDependencies = () => {
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
    AppDataSource.initialize();
    //Repositories
    const billRepository = AppDataSource.getRepository(Bill_1.Bill);
    //Services'
    const billService = new BillService_1.BillService(billRepository);
    (0, BillController_1.setService)(billService);
};
exports.initializeDependencies = initializeDependencies;
module.exports = { initializeDependencies: exports.initializeDependencies };
