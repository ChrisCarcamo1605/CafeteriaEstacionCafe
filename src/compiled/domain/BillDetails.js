"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillDetails = void 0;
class BillDetails {
    constructor(billDetailId, billId, productId, quantity, subTotal) {
        this.billDetailId = billDetailId;
        this.billId = billId;
        this.productId = productId;
        this.quantity = quantity;
        this.subTotal = subTotal;
    }
}
exports.BillDetails = BillDetails;
