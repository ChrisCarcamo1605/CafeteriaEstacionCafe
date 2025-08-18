
export class Producto {
    productId: bigint;
    name: string;
    description: string;
    price: number;
    cost: number;
    active: boolean;

    constructor(productId: bigint, name: string, description: string, price: number, cost: number, active: boolean) {
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.cost = cost;
        this.active = active;
    }
}

