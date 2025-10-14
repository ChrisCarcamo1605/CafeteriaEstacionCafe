import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Producto";
import { Bill } from "./Bill";

@Entity("bill_details")
export class BillDetails {
  @PrimaryGeneratedColumn("increment", { name: "bill_details_id" })
  billDetailId: number = 0;
  @Column({ name: "bill_id" })
  billId: number = 0;
  @Column({ name: "product_id" })
  productId: number = 0;
  @Column("integer")
  quantity: number = 0;
  @Column("decimal", { name: "sub_total", precision: 10, scale: 2 })
  subTotal: number = 0;

  @ManyToOne(() => Product, (product) => product.billDetails)
  @JoinColumn({ name: "product_id" })
  product?: Product;

  @ManyToOne(() => Bill, (product) => product.billId)
  @JoinColumn({name:"bill_Id"})
  bill?: Bill;

  constructor() {}
}
