export class Bill{
    billId:bigint;
    cashRegister: bigint;
    customer:string;
    date:Date;
    total: number;

    constructor(billId:bigint, cashRegister:bigint, customer:string, date:Date, total:number){
        this.billId = billId;
        this.cashRegister = cashRegister;
        this.customer = customer;
        this.date =  date;
        this.total = total;
    }
}