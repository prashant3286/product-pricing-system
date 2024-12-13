const API_BASE_URL = 'http://localhost:8000/api/pizza';

export interface ApiTopping {
  id: number;
  name: string;
  price: number;
  type: 'veggie' | 'meat';
}

export interface ApiSize {
  id: number;
  name: string;
  price_adjustment: number;
}

export interface ApiCheeseType {
  id: number;
  name: string;
  price_adjustment: number;
}

export interface ApiPriceBreakdown {
  base: number;
  size: number;
  cheese: number;
  toppings: {
    id: string;
    name: string;
    original_price: number;
    final_price: number;
    is_free: boolean;
  }[];
  total: number;
  original_total: number;
  total_discount: number;
}

export interface OrderResponse {
  id: number;
  status: string;
  total_price: number;
  original_price: number;
  total_discount: number;
}
export const fetchToppings = async (): Promise<ApiTopping[]> => {
  const response = await fetch(`${API_BASE_URL}/toppings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
export const fetchSizes = async (): Promise<ApiSize[]> => {
  const response = await fetch(`${API_BASE_URL}/sizes`);
  return response.json();
};

export const fetchCheeseTypes = async (): Promise<ApiCheeseType[]> => {
  const response = await fetch(`${API_BASE_URL}/cheese-types`);
  return response.json();
};

export const calculatePrice = async (
  sizeId: number,
  cheeseId: number,
  toppingIds: number[]
): Promise<ApiPriceBreakdown> => {
  const response = await fetch(`${API_BASE_URL}/calculate-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size_id: sizeId,
      cheese_id: cheeseId,
      topping_ids: toppingIds,
    }),
  });
  return response.json();
};

export const placeOrder = async (
  order: {
    size_id: number;
    cheese_id: number;
    topping_ids: number[];
  }
): Promise<OrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
  
  if (!response.ok) {
    throw new Error('Failed to place order');
  }
  
  return response.json();
};