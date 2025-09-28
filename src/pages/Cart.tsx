import { ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CartPage from "../components/CartLogic";
import Footer from "../components/Footer";
import Loader from "../components/nexgadMidPageLoader";
import CompactProductGrid from "../components/OptListings";
import { useAppContext } from "../context/AppContext";
import api from "../utils/api";
import { useToast } from "../utils/ToastNotification";

const Cart = () => {
  const { cart, isAuthenticated, setCart } = useAppContext();
  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<string>("");
  const cartItem = cart?.items || [];
  const navigate = useNavigate();
  const toast = useToast();

  const handleNetworkError = useCallback(
    (err: any) => {
      console.error("Network error:", err);

      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (
        err?.code === "ERR_NETWORK" ||
        err?.code === "ECONNABORTED" ||
        (err?.message && err.message.includes("Network Error"))
      ) {
        toast.error(
          "Network connection error. Please check your internet connection."
        );
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
    [toast]
  );

  const handleGetCart = async () => {
    setIsCartLoading(true);
    try {
      const request = await api.get("/cart");
      const response = request.data;

      const cart = response.data;

      setCart(cart);
    } catch (err) {
      console.error(err);
      handleNetworkError(err);
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleIncreament = async (listingId: string) => {
    setIsActionLoading(listingId);
    try {
      const request = await api.patch(
        `/cart/product/increase-quantity/${listingId}`
      );
      const response = request.data;

      const updatedCart = response.data;
      console.log("updatedcart", updatedCart);
      setCart(updatedCart);
    } catch (err: any) {
      console.error(err);
      handleNetworkError(err);
    } finally {
      setIsActionLoading("");
    }
  };

  const handleDecreament = async (listingId: string) => {
    setIsActionLoading(listingId);
    try {
      const request = await api.patch(
        `/cart/product/decrease-quantity/${listingId}`
      );
      const response = request.data;

      const updatedCart = response.data;
      console.log("updatedcart", updatedCart);
      setCart(updatedCart);
    } catch (err: any) {
      console.error(err);
      handleNetworkError(err);
    } finally {
      setIsActionLoading("");
    }
  };

  const handleRemoveItem = async (
    listingId: string,
    safeForLater: boolean = false
  ) => {
    setIsActionLoading(listingId);
    if (safeForLater) {
      try {
        const [removeItemRes, addToWishlistRes] = await Promise.all([
          await api.delete(`/cart/product/remove/${listingId}`),
          await api.post(`/wishlist/${listingId}`),
        ]);

        const response = removeItemRes.data;
        const updatedCart = response.data;

        console.log("updatedcart", updatedCart);

        setCart(updatedCart);
        toast.success("", "item removed from cart successfull");
        toast.success("", "Product added to wishlist");
      } catch (err: any) {
        console.error(err);
        handleNetworkError(err);
      } finally {
        setIsActionLoading("");
      }
    } else {
      try {
        const request = await api.delete(`/cart/product/remove/${listingId}`);
        const response = request.data;

        const updatedCart = response.data;
        console.log("updatedcart", updatedCart);
        setCart(updatedCart);
        toast.success("", "item removed from cart successfull");
      } catch (err: any) {
        console.error(err);
        handleNetworkError(err);
      } finally {
        setIsActionLoading("");
      }
    }
  };

  useEffect(() => {
    setCart(null);
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("", "Login to access your cart");
      return;
    }
    handleGetCart();
  }, []);

  console.log("first");
  return (
    <>
      {isCartLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader size={64} thickness={1} />
        </div>
      ) : cartItem.length === 0 || !cartItem || cartItem === null ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-[#CBDCEB]/30 flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-[#456882]" />
              </div>
              <h2 className="text-3xl font-bold text-[#1B3C53] mb-4">
                Your cart is empty
              </h2>
              <p className="text-lg text-[#456882]/70 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start
                exploring amazing gadgets!
              </p>
              <NavLink
                to="/listings"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1B3C53] to-[#456882] text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Start Shopping</span>
              </NavLink>
            </div>
          </div>
        </div>
      ) : (
        <>
          <CartPage
            initialCartItems={cartItem}
            onIncreamentQuantity={handleIncreament}
            ondecreamentQuantity={handleDecreament}
            isActionLoading={isActionLoading}
            onRemoveItem={handleRemoveItem}
            cart={cart}
          />
          <CompactProductGrid maxItems={4} showTitle={false} />
        </>
      )}
      <Footer />
    </>
  );
};

export default Cart;
