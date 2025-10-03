import { Repository } from "typeorm";
import { IService } from "../../domain/interfaces/IService";
import { Bill } from "../../domain/entities/Bill";
import { SaveBillDTO } from "../DTOs/BillsDTO";
import { da } from "zod/v4/locales";

export class BillService implements IService {
  public constructor(private billRepository: Repository<Bill>) {
    this.billRepository = billRepository;
  }
  saveAll(body: any[]): Promise<any[]> {
    throw new Error("Method not implemented.");
  }

  async save(body: any): Promise<any> {
    console.log(`Entrando al metodo createBill`);
    const data: SaveBillDTO = body;
    const bill: Bill = new Bill();
    bill.total = data.total;
    bill.customer = data.customer;
    bill.date =  data.date;

    return await this.billRepository.save(bill);
  }

  delete(id: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<any[]> {
    console.log(`Obteniendo bills...`);
    return this.billRepository.find();
  }
}
