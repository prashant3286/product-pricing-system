import React from 'react';
import { Pizza, ChefHat, DollarSign } from 'lucide-react';
import usePizzaStore from '../store/pizzaStore';
import { VEGGIE_TOPPINGS, MEAT_TOPPINGS } from '../data/toppings';
import { Size, CheeseType } from '../types/pizza';
import { fetchToppings, placeOrder } from '../api/pizza';

const PizzaBuilder: React.FC = () => {
  const {
    size,
    cheese,
    toppings,
    setSize,
    setCheese,
    addTopping,
    removeTopping,
    getPriceBreakdown
  } = usePizzaStore();

  const priceBreakdown = getPriceBreakdown();
  const selectedToppings = new Set(toppings.map(t => t.id));

  const formatPrice = (price: number) => `$${Math.abs(price).toFixed(2)}`;

  const handlePlaceOrder = async () => {
    try {

      fetchToppings()
  .then(toppings => {
    console.log(toppings);
    // Process the toppings data here
  })
  .catch(error => {
    console.error(error);
    // Handle any errors that occurred during the fetch
  });
     
      const toppingIdsResponse = await fetchToppings();
      const toppingIdsData =  toppingIdsResponse;
    const toppingIds = toppingIdsData.map(topping => topping.id);


    console.log(toppingIds);
    const order = await placeOrder({
      size_id: size === 'small' ? 1 : size === 'medium' ? 2 : 3,
      cheese_id: cheese === 'mozzarella' ? 1 : 2,
      topping_ids: toppingIds
    });
      
      alert(`Order placed successfully! Order ID: ${order.id}`);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-orange-600 p-6 text-white flex items-center gap-3">
          <Pizza className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Pizza Builder</h1>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <ChefHat className="w-5 h-5" />
                Customize Your Pizza
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Size</h3>
                  <div className="flex gap-3">
                    {(['small', 'medium', 'large'] as Size[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-4 py-2 rounded-lg capitalize ${
                          size === s
                            ? 'bg-orange-600 text-white'
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Cheese</h3>
                  <div className="flex gap-3">
                    {(['mozzarella', 'vegan'] as CheeseType[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCheese(c)}
                        className={`px-4 py-2 rounded-lg capitalize ${
                          cheese === c
                            ? 'bg-orange-600 text-white'
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Veggie Toppings (First 2 Free!)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {VEGGIE_TOPPINGS.map((topping) => (
                      <button
                        key={topping.id}
                        onClick={() => 
                          selectedToppings.has(topping.id)
                            ? removeTopping(topping.id)
                            : addTopping(topping)
                        }
                        className={`px-4 py-2 rounded-lg text-left ${
                          selectedToppings.has(topping.id)
                            ? 'bg-orange-600 text-white'
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        }`}
                      >
                        {topping.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Meat Toppings</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {MEAT_TOPPINGS.map((topping) => (
                      <button
                        key={topping.id}
                        onClick={() => 
                          selectedToppings.has(topping.id)
                            ? removeTopping(topping.id)
                            : addTopping(topping)
                        }
                        className={`px-4 py-2 rounded-lg text-left ${
                          selectedToppings.has(topping.id)
                            ? 'bg-orange-600 text-white'
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        }`}
                      >
                        {topping.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="bg-orange-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5" />
              Price Breakdown
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Base Pizza</span>
                <span>{formatPrice(priceBreakdown.base)}</span>
              </div>

              {priceBreakdown.size !== 0 && (
                <div className="flex justify-between">
                  <span>Size ({size})</span>
                  <span>{priceBreakdown.size > 0 ? '+' : ''}{formatPrice(priceBreakdown.size)}</span>
                </div>
              )}

              {priceBreakdown.cheese !== 0 && (
                <div className="flex justify-between">
                  <span>Cheese ({cheese})</span>
                  <span>+{formatPrice(priceBreakdown.cheese)}</span>
                </div>
              )}

              {priceBreakdown.toppings.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Toppings</h3>
                  <div className="space-y-2">
                    {priceBreakdown.toppings.map((topping) => (
                      <div key={topping.id} className="flex justify-between">
                        <span>{topping.name}</span>
                        <div>
                          {topping.isFree ? (
                            <span>
                              <span className="line-through text-gray-400 mr-2">
                                {formatPrice(topping.originalPrice)}
                              </span>
                              <span className="text-green-600">Free!</span>
                            </span>
                          ) : (
                            <span>+{formatPrice(topping.finalPrice)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-orange-200">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(priceBreakdown.total)}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaBuilder;