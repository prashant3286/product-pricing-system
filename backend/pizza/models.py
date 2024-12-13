from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from decimal import Decimal

class Size(models.Model):
    name = models.CharField(max_length=50)
    price_adjustment = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.name

class CheeseType(models.Model):
    name = models.CharField(max_length=50)
    price_adjustment = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.name

class Topping(models.Model):
    TOPPING_TYPES = [
        ('veggie', 'Vegetable'),
        ('meat', 'Meat'),
    ]
    
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    type = models.CharField(max_length=10, choices=TOPPING_TYPES)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.type})"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered'),
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    base_price = models.DecimalField(max_digits=6, decimal_places=2)
    size = models.ForeignKey(Size, on_delete=models.PROTECT)
    cheese = models.ForeignKey(CheeseType, on_delete=models.PROTECT)
    total_price = models.DecimalField(max_digits=6, decimal_places=2)
    original_price = models.DecimalField(max_digits=6, decimal_places=2)
    total_discount = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    
    def __str__(self):
        return f"Order #{self.id} - {self.status}"

    def calculate_total_discount(self):
        return self.original_price - self.total_price

class OrderTopping(models.Model):
    order = models.ForeignKey(Order, related_name='toppings', on_delete=models.CASCADE)
    topping = models.ForeignKey(Topping, on_delete=models.PROTECT)
    is_free = models.BooleanField(default=False)
    original_price = models.DecimalField(max_digits=5, decimal_places=2)
    final_price = models.DecimalField(max_digits=5, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))

    def __str__(self):
        return f"{self.order.id} - {self.topping.name}"

    def save(self, *args, **kwargs):
        if not self.discount:
            self.discount = self.original_price - self.final_price
        super().save(*args, **kwargs)

class PriceAudit(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    component_type = models.CharField(max_length=50)  # 'size', 'cheese', 'topping'
    component_name = models.CharField(max_length=100)
    original_price = models.DecimalField(max_digits=6, decimal_places=2)
    final_price = models.DecimalField(max_digits=6, decimal_places=2)
    discount = models.DecimalField(max_digits=6, decimal_places=2)
    discount_reason = models.CharField(max_length=200)

    def __str__(self):
        return f"Price Audit #{self.id} - Order #{self.order.id}"