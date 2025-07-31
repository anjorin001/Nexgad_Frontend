import { FaShoppingCart, FaTrash, FaArrowLeft, FaCreditCard } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import dummyImage from "../assets/dummyImage.jpeg";

const CartPage = () => {
  // Sample cart data
  const cartItems = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 149.99,
      quantity: 1,
      image: dummyImage,
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      quantity: 2,
      image: dummyImage,
    },
    {
      id: 3,
      name: "Stainless Steel Water Bottle",
      price: 24.95,
      quantity: 1,
      image: dummyImage,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[#FFFF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#1B3C53] flex items-center">
            <FaShoppingCart className="mr-2" />
            Your Shopping Cart
          </h1>
          <span className="text-[#456882]">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {/* Back to shopping button */}
            <button className="flex items-center text-[#456882] hover:text-[#1B3C53] mb-6 transition-colors">
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </button>

            {/* Cart Items List */}
            <div className="bg-white rounded-lg shadow-sm border border-[#CBDCEB] divide-y divide-[#CBDCEB]">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded mr-4 mb-4 sm:mb-0"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="text-[#1B3C53] font-medium">{item.name}</h3>
                      <button className="text-[#456882] hover:text-red-500">
                        <FaTrash />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#CBDCEB] rounded">
                        <button className="px-3 py-1 text-[#456882] hover:bg-[#CBDCEB]">
                          -
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button className="px-3 py-1 text-[#456882] hover:bg-[#CBDCEB]">
                          +
                        </button>
                      </div>
                      <span className="text-[#1B3C53] font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-[#CBDCEB] p-6 sticky top-4">
              <h2 className="text-xl font-bold text-[#1B3C53] mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#1B3C53]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#1B3C53]">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#1B3C53]">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#CBDCEB] pt-3 flex justify-between font-bold text-[#1B3C53]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-[#456882] hover:bg-[#1B3C53] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors">
                <FaCreditCard className="mr-2" />
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center text-sm text-[#456882]">
                <HiOutlineShoppingBag className="mx-auto text-2xl mb-2" />
                <p>Free returns within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;