import {Entity,PrimaryGeneratedColumn,Column} from "typeorm";

@Entity()
export class Bill{
    @PrimaryGeneratedColumn()
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