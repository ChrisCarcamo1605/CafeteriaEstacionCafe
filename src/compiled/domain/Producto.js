"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = void 0;
class Producto {
    constructor(productId, name, description, price, cost, active) {
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.cost = cost;
        this.active = active;
    }
}
exports.Producto = Producto;
