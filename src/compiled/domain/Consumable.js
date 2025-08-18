"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consumable = void 0;
class Consumable {
    constructor(consumableId, supplier, name, consumableType, quantity, unitMeasurement, cost) {
        this.consumableId = consumableId;
        this.supplier = supplier;
        this.name = name;
        this.consumableType = consumableType;
        this.quantity = quantity;
        this.unitMeasurement = unitMeasurement;
        this.cost = cost;
    }
}
exports.Consumable = Consumable;
