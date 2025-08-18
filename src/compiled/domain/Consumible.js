"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Consumable {
    constructor(consumableId, supplier, name, consumableType) {
        this.consumableId = consumableId;
        this.consumableType = consumableType;
        this.name = name;
        this.supplier = supplier;
    }
}
