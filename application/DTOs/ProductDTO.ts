export interface SaveProductDTO {
    name: string;
    description: string;
    price: number;
    cost: number;
    active?: boolean;
}

export interface ProductItemDTO {
    productId: number;
    name: string;
    description: string;
    price: number;
    cost: number;
    active: boolean;
}

export interface UpdateProductDTO {
    productId?: number;
    name?: string;
    description?: string;
    price?: number;
    cost?: number;
    active?: boolean;
}

export interface ProductWithIngredientsCostDTO {
    productId: number;
    name: string;
    description: string;
    price: number;
    cost: number;
    ingredientsCost: number;
    profitMargin: number;
    active: boolean;
}
