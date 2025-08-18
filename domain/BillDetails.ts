export class BillDetails{
    billDetailId: bigint;
    billId: bigint;
    productId:bigint;
    quantity: number;
    subTotal: number;

    constructor(billDetailId:bigint, billId:bigint, productId:bigint, quantity:number, subTotal:number){
        this.billDetailId = billDetailId;
        this.billId = billId;
        this.productId = productId;
        this.quantity = quantity;
        this.subTotal = subTotal;
    }
}