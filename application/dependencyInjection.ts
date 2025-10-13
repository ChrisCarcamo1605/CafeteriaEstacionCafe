import { Bill } from "../domain/entities/Bill";
import { IService } from "../domain/interfaces/IService";
import { BillService } from "./services/BillService";
import { setService as setBillService } from "../controller/BillController";
import { setService as setProductService } from "../controller/ProductController";
import { setService as setBillDetailsService } from "../controller/BillDetailsController";
import { getDataSource } from "../infrastructure/db/Connection";
import { Product } from "../domain/entities/Producto";
import { ProductService } from "./services/ProductService";
import { BillDetailsService } from "./services/BillDetailsService";
import { BillDetails } from "../domain/entities/BillDetails";

export const initializeDependencies = () => {
  const AppDataSource = getDataSource();
  AppDataSource.initialize();
  console.log(`Conexion exitosa a la base de datos`);

  //Repositories
  const billRepository = AppDataSource.getRepository(Bill);
  const productRepository = AppDataSource.getRepository(Product);
  const billDetailsRepository = AppDataSource.getRepository(BillDetails);

  //Services'
  const billService: IService = new BillService(billRepository);
  const productService: IService = new ProductService(productRepository);
  const billDetailsService: IService = new BillDetailsService(
    billDetailsRepository
  );

  setBillService(billService);
  setProductService(productService);
  setBillDetailsService(billDetailsService);
};

module.exports = { initializeDependencies };
