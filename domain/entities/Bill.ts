import {Entity,PrimaryGeneratedColumn,Column} from "typeorm";

@Entity("bills")
export class Bill{
    @PrimaryGeneratedColumn({name:"bill_id"})
    billId:number = 1;

    @Column()
    cashRegister: number= 1;
    @Column()
    customer:string ="";
    @Column()
    date:Date = new Date;
    @Column()
    total: number= 0;

}