from ninja import Schema
from typing import List
from decimal import Decimal

class ToppingSchema(Schema):
    id: int
    name: str
    price: Decimal
    type: str

class SizeSchema(Schema):
    id: int
    name: str
    price_adjustment: Decimal

class CheeseTypeSchema(Schema):
    id: int
    name: str
    price_adjustment: Decimal

class OrderToppingSchema(Schema):
    id: str
    name: str
    original_price: Decimal
    final_price: Decimal
    is_free: bool

class PriceBreakdownSchema(Schema):
    base: Decimal
    size: Decimal
    cheese: Decimal
    toppings: List[OrderToppingSchema]
    total: Decimal
    original_total: Decimal
    total_discount: Decimal

class CreateOrderSchema(Schema):
    size_id: int
    cheese_id: int
    topping_ids: List[int]

class OrderResponseSchema(Schema):
    id: int
    status: str
    total_price: float
    original_price: float
    total_discount: float