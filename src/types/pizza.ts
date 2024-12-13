export type Size = 'small' | 'medium' | 'large';
export type CheeseType = 'mozzarella' | 'vegan';

export interface Topping {
  id: string;
  name: string;
  price: number;
  type: 'veggie' | 'meat';
  selected?: boolean;
}

export interface PizzaState {
  basePrice: number;
  size: Size;
  cheese: CheeseType;
  toppings: Topping[];
  addTopping: (topping: Topping) => void;
  removeTopping: (toppingId: string) => void;
  setSize: (size: Size) => void;
  setCheese: (cheese: CheeseType) => void;
  calculateTotal: () => number;
  getPriceBreakdown: () => PriceBreakdown;
}

export interface PriceBreakdown {
  base: number;
  size: number;
  cheese: number;
  toppings: {
    id: string;
    name: string;
    originalPrice: number;
    finalPrice: number;
    isFree: boolean;
  }[];
  total: number;
}