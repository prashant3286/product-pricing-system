import { Topping } from '../types/pizza';

export const VEGGIE_TOPPINGS: Topping[] = [
  { id: 'tomato', name: 'Tomato', price: 1, type: 'veggie' },
  { id: 'onion', name: 'Onion', price: 1, type: 'veggie' },
  { id: 'olive', name: 'Olive', price: 1, type: 'veggie' },
  { id: 'mushroom', name: 'Mushroom', price: 1, type: 'veggie' }
];

export const MEAT_TOPPINGS: Topping[] = [
  { id: 'pepperoni', name: 'Pepperoni', price: 2.50, type: 'meat' },
  { id: 'sausage', name: 'Sausage', price: 2.75, type: 'meat' },
  { id: 'bacon', name: 'Bacon', price: 3.00, type: 'meat' }
];