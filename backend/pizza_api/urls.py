from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
from pizza.api import router as pizza_router

api = NinjaAPI()
api.add_router("/pizza/", pizza_router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]