import { ConsumibleType } from "./Enums/ConsumibleType";
import { UnitMeasurement } from "./Enums/UnitMeasurement";

export class Consumable {
  consumableId: bigint;
  supplier: bigint;
  name: string;
  consumableType: ConsumibleType;
  quantity: number;
  unitMeasurement: UnitMeasurement;
  cost: number;

  constructor(
    consumableId: bigint,
    supplier: bigint,
    name: string,
    consumableType: ConsumibleType,
    quantity: number,
    unitMeasurement: UnitMeasurement,
    cost: number
  ) {
    this.consumableId = consumableId;
    this.supplier = supplier;
    this.name = name;
    this.consumableType = consumableType;
    this.quantity = quantity;
    this.unitMeasurement = unitMeasurement;
    this.cost = cost;
  }
}
