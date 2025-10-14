"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillDetailsService = void 0;
const BillDetails_1 = require("../../domain/entities/BillDetails");
class BillDetailsService {
    constructor(repository) {
        this.repository = repository;
        this.repository = repository;
    }
    save(body) {
        throw new Error("Method not implemented.");
    }
    saveAll(body) {
        const details = [];
        body.forEach((detail) => {
            const newDetail = new BillDetails_1.BillDetails();
            newDetail.billId = detail.billId;
            newDetail.productId = detail.productId;
            newDetail.quantity = detail.quantity;
            newDetail.subTotal = detail.subTotal;
            console.log('EL BILL DETAIL ES: ');
            console.log(newDetail);
            details.push(newDetail);
        });
        return this.repository.save(details);
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    update(body) {
        throw new Error("Method not implemented.");
    }
    getAll() {
        return this.repository.find({
            relations: ["product", "bill"],
        });
    }
}
exports.BillDetailsService = BillDetailsService;
