"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bill = void 0;
class Bill {
    constructor(billId, cashRegister, customer, date, total) {
        this.billId = billId;
        this.cashRegister = cashRegister;
        this.customer = customer;
        this.date = date;
        this.total = total;
    }
}
exports.Bill = Bill;
