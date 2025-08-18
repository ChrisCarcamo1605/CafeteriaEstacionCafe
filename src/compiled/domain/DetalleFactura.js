"use strict";
class Ingredient {
    constructor(ingredientId, consumibleId, name, quantity, productId) {
        this.consumibleId = consumibleId;
        this.productId = productId;
        this.name = name;
        this.ingredientId = ingredientId;
        this.quantity = quantity;
    }
}
