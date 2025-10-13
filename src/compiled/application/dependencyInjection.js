"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDependencies = void 0;
const Bill_1 = require("../domain/entities/Bill");
const BillService_1 = require("./services/BillService");
const BillController_1 = require("../controller/BillController");
const ProductController_1 = require("../controller/ProductController");
const BillDetailsController_1 = require("../controller/BillDetailsController");
const Connection_1 = require("../infrastructure/db/Connection");
const Producto_1 = require("../domain/entities/Producto");
const ProductService_1 = require("./services/ProductService");
const BillDetailsService_1 = require("./services/BillDetailsService");
const BillDetails_1 = require("../domain/entities/BillDetails");
const initializeDependencies = () => {
    const AppDataSource = (0, Connection_1.getDataSource)();
    AppDataSource.initialize();
    console.log(`Conexion exitosa a la base de datos`);
    //Repositories
    const billRepository = AppDataSource.getRepository(Bill_1.Bill);
    const productRepository = AppDataSource.getRepository(Producto_1.Product);
    const billDetailsRepository = AppDataSource.getRepository(BillDetails_1.BillDetails);
    //Services'
    const billService = new BillService_1.BillService(billRepository);
    const productService = new ProductService_1.ProductService(productRepository);
    const billDetailsService = new BillDetailsService_1.BillDetailsService(billDetailsRepository);
    (0, BillController_1.setService)(billService);
    (0, ProductController_1.setService)(productService);
    (0, BillDetailsController_1.setService)(billDetailsService);
};
exports.initializeDependencies = initializeDependencies;
module.exports = { initializeDependencies: exports.initializeDependencies };
