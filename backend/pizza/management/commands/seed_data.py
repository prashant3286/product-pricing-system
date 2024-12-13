from django.core.management.base import BaseCommand
from pizza.models import Size, CheeseType, Topping
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seeds the database with initial pizza data'

    def handle(self, *args, **kwargs):
        # Create sizes
        sizes_data = [
            {'name': 'small', 'price_adjustment': Decimal('-2.00')},
            {'name': 'medium', 'price_adjustment': Decimal('0.00')},
            {'name': 'large', 'price_adjustment': Decimal('2.00')},
        ]
        for size_data in sizes_data:
            Size.objects.get_or_create(
                name=size_data['name'],
                defaults={'price_adjustment': size_data['price_adjustment']}
            )

        # Create cheese types
        cheese_types_data = [
            {'name': 'mozzarella', 'price_adjustment': Decimal('0.00')},
            {'name': 'vegan', 'price_adjustment': Decimal('2.00')},
        ]
        for cheese_data in cheese_types_data:
            CheeseType.objects.get_or_create(
                name=cheese_data['name'],
                defaults={'price_adjustment': cheese_data['price_adjustment']}
            )

        # Create toppings
        veggie_toppings = [
            {'id': 1, 'name': 'Tomato', 'price': Decimal('1.00'), 'type': 'veggie'},
            {'id': 2, 'name': 'Onion', 'price': Decimal('1.00'), 'type': 'veggie'},
            {'id': 3, 'name': 'Olive', 'price': Decimal('1.00'), 'type': 'veggie'},
            {'id': 4, 'name': 'Mushroom', 'price': Decimal('1.00'), 'type': 'veggie'},
        ]

        meat_toppings = [
            {'id': 5, 'name': 'Pepperoni', 'price': Decimal('2.50'), 'type': 'meat'},
            {'id': 6, 'name': 'Sausage', 'price': Decimal('2.75'), 'type': 'meat'},
            {'id': 7, 'name': 'Bacon', 'price': Decimal('3.00'), 'type': 'meat'},
        ]
        
        for topping_data in veggie_toppings + meat_toppings:
            Topping.objects.get_or_create(
                name=topping_data['name'],
                defaults={
                    'price': topping_data['price'],
                    'type': topping_data['type']
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database'))