from ninja import Router
from typing import List
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db import transaction
from pizza.models import Size, CheeseType, Topping, Order, OrderTopping, PriceAudit
from .schemas import (
    ToppingSchema, 
    SizeSchema, 
    CheeseTypeSchema, 
    PriceBreakdownSchema,
    CreateOrderSchema,
    OrderResponseSchema
)

router = Router()

BASE_PRICE = Decimal('10.00')

@router.get("/sizes", response=List[SizeSchema])
def list_sizes(request):
    return Size.objects.all()

@router.get("/cheese-types", response=List[CheeseTypeSchema])
def list_cheese_types(request):
    return CheeseType.objects.all()

@router.get("/toppings", response=List[ToppingSchema])
def list_toppings(request):
    from django.http import JsonResponse


    toppings= Topping.objects.filter(available=True)
    data = [{'id': topping.id, 'name': topping.name} for topping in toppings]

    return JsonResponse(data, safe=False)

@router.post("/calculate-price", response=PriceBreakdownSchema)
def calculate_price(request, data: CreateOrderSchema):
    size = get_object_or_404(Size, id=data.size_id)
    cheese = get_object_or_404(CheeseType, id=data.cheese_id)
    toppings = Topping.objects.filter(id__in=data.topping_ids)
    
    veggie_toppings = [t for t in toppings if t.type == 'veggie']
    meat_toppings = [t for t in toppings if t.type == 'meat']
    
    topping_breakdown = []
    
    # Process veggie toppings (first 2 free)
    for i, topping in enumerate(veggie_toppings):
        is_free = i < 2
        final_price = Decimal('0.00') if is_free else topping.price
        topping_breakdown.append({
            'id': str(topping.id),
            'name': topping.name,
            'original_price': topping.price,
            'final_price': final_price,
            'is_free': is_free
        })
    
    # Process meat toppings
    for topping in meat_toppings:
        topping_breakdown.append({
            'id': str(topping.id),
            'name': topping.name,
            'original_price': topping.price,
            'final_price': topping.price,
            'is_free': False
        })
    
    # Calculate totals
    toppings_total = sum(t['final_price'] for t in topping_breakdown)
    original_toppings_total = sum(t['original_price'] for t in topping_breakdown)
    total = BASE_PRICE + size.price_adjustment + cheese.price_adjustment + toppings_total
    original_total = BASE_PRICE + size.price_adjustment + cheese.price_adjustment + original_toppings_total
    
    return {
        'base': BASE_PRICE,
        'size': size.price_adjustment,
        'cheese': cheese.price_adjustment,
        'toppings': topping_breakdown,
        'total': total,
        'original_total': original_total,
        'total_discount': original_total - total
    }

@router.post("/orders", response=OrderResponseSchema)
@transaction.atomic
def create_order(request, data: CreateOrderSchema):
    print("Creating order...")
    # Calculate price breakdown
    price_breakdown = calculate_price(request, data)
    
    # Get components
    size = get_object_or_404(Size, id=data.size_id)
    cheese = get_object_or_404(CheeseType, id=data.cheese_id)
    toppings = Topping.objects.filter(id__in=data.topping_ids)
    
    # Create order
    order = Order.objects.create(
        base_price=BASE_PRICE,
        size=size,
        cheese=cheese,
        total_price=price_breakdown['total'],
        original_price=price_breakdown['original_total'],
        total_discount=price_breakdown['total_discount']
    )
    
    # Create order toppings with price tracking
    for topping_data in price_breakdown['toppings']:
        topping = get_object_or_404(Topping, id=int(topping_data['id']))
        OrderTopping.objects.create(
            order=order,
            topping=topping,
            is_free=topping_data['is_free'],
            original_price=topping_data['original_price'],
            final_price=topping_data['final_price']
        )
        
        # Create price audit for the topping
        if topping_data['is_free']:
            PriceAudit.objects.create(
                order=order,
                component_type='topping',
                component_name=topping.name,
                original_price=topping_data['original_price'],
                final_price=topping_data['final_price'],
                discount=topping_data['original_price'] - topping_data['final_price'],
                discount_reason='First 2 veggie toppings free promotion'
            )
    
    # Create price audits for base components
    PriceAudit.objects.create(
        order=order,
        component_type='base',
        component_name='Base Pizza',
        original_price=BASE_PRICE,
        final_price=BASE_PRICE,
        discount=Decimal('0.00'),
        discount_reason='Base price'
    )
    
    PriceAudit.objects.create(
        order=order,
        component_type='size',
        component_name=size.name,
        original_price=size.price_adjustment,
        final_price=size.price_adjustment,
        discount=Decimal('0.00'),
        discount_reason='Size adjustment'
    )
    
    PriceAudit.objects.create(
        order=order,
        component_type='cheese',
        component_name=cheese.name,
        original_price=cheese.price_adjustment,
        final_price=cheese.price_adjustment,
        discount=Decimal('0.00'),
        discount_reason='Cheese type adjustment'
    )
    
    return {
        "id": order.id,
        "status": order.status,
        "total_price": float(order.total_price),
        "original_price": float(order.original_price),
        "total_discount": float(order.total_discount)
    }