import { create } from 'zustand';
import { PizzaState, Size, CheeseType, Topping, PriceBreakdown } from '../types/pizza';

const PRICES = {
  base: 10,
  size: {
    small: -2,
    medium: 0,
    large: 2
  },
  cheese: {
    mozzarella: 0,
    vegan: 2
  }
};

const usePizzaStore = create<PizzaState>((set, get) => ({
  basePrice: PRICES.base,
  size: 'medium',
  cheese: 'mozzarella',
  toppings: [],

  setSize: (size: Size) => set({ size }),
  setCheese: (cheese: CheeseType) => set({ cheese }),

  addTopping: (topping: Topping) => {
    set((state) => ({
      toppings: [...state.toppings, { ...topping, selected: true }]
    }));
  },

  removeTopping: (toppingId: string) => {
    set((state) => ({
      toppings: state.toppings.filter((t) => t.id !== toppingId)
    }));
  },

  calculateTotal: () => {
    const state = get();
    const sizePrice = PRICES.size[state.size];
    const cheesePrice = PRICES.cheese[state.cheese];
    
    const veggieToppings = state.toppings.filter(t => t.type === 'veggie');
    const meatToppings = state.toppings.filter(t => t.type === 'meat');
    
    const toppingsTotal = veggieToppings.reduce((acc, t, index) => {
      return acc + (index < 2 ? 0 : t.price);
    }, 0) + meatToppings.reduce((acc, t) => acc + t.price, 0);

    return state.basePrice + sizePrice + cheesePrice + toppingsTotal;
  },

  getPriceBreakdown: () => {
    const state = get();
    const sizePrice = PRICES.size[state.size];
    const cheesePrice = PRICES.cheese[state.cheese];
    
    const veggieToppings = state.toppings.filter(t => t.type === 'veggie');
    const meatToppings = state.toppings.filter(t => t.type === 'meat');
    
    const toppingsBreakdown = [
      ...veggieToppings.map((t, index) => ({
        id: t.id,
        name: t.name,
        originalPrice: t.price,
        finalPrice: index < 2 ? 0 : t.price,
        isFree: index < 2
      })),
      ...meatToppings.map(t => ({
        id: t.id,
        name: t.name,
        originalPrice: t.price,
        finalPrice: t.price,
        isFree: false
      }))
    ];

    return {
      base: state.basePrice,
      size: sizePrice,
      cheese: cheesePrice,
      toppings: toppingsBreakdown,
      total: state.calculateTotal()
    };
  }
}));

export default usePizzaStore;