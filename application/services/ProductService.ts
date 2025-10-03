import { Repository } from "typeorm";
import { Product } from "../../domain/entities/Producto";
import { IService } from "../../domain/interfaces/IService";


export class ProductService implements IService {
  constructor(private productRepository: Repository<Product>) {
    this.productRepository = productRepository;
  }
  saveAll(body: any[]): Promise<any[]> {
    throw new Error("Method not implemented.");
  }

  save(body: any): Promise<any> {

    const data = body;
    const prod = new Product();
    prod.productId = data.productId;
    prod.name = data.name;
    prod.description = data.description;
    prod.price = data.price;
    prod.cost = data.cost;

    return this.productRepository.save(prod);
  }
  delete(id: number): Promise<any> {
    return this.productRepository.delete(id);
  }
  update(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<any[]> {
    return this.productRepository.find();
  }
}
