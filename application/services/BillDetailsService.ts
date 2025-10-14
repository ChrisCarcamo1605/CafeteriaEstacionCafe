import { Repository } from "typeorm";
import { IService } from "../../domain/interfaces/IService";
import { BillDetails } from "../../domain/entities/BillDetails";
import { BillDetailsSchema } from "../validations/BillDetailsValidations";

export class BillDetailsService implements IService {
  constructor(private repository: Repository<BillDetails>) {
    this.repository = repository;
  }

  save(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
   saveAll(body: any[]): Promise<any[]> {
    const details: BillDetails[] = [];
    body.forEach((detail: any) => {
      const newDetail = new BillDetails();
      newDetail.billId = detail.billId;
      newDetail.productId = detail.productId;
      newDetail.quantity = detail.quantity;
      newDetail.subTotal = detail.subTotal;
      console.log('EL BILL DETAIL ES: ');
      console.log( newDetail);
      
      details.push(newDetail);
    });

    return this.repository.save(details);
  }
  delete(id: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<any[]> {
    return this.repository.find({
      relations: ["product","bill"],

    });
  }
}
