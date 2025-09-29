import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartPage from "../components/CartLogic";
import Footer from "../components/Footer";
import CompactProductGrid from "../components/OptListings";
import { useAppContext } from "../context/AppContext";
import api from "../utils/api";
import { useToast } from "../utils/ToastNotification";

const Cart = () => {
  const { cart, isAuthenticated, setCart } = useAppContext();
  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<string>("");

  const cartItem = cart?.items;

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
        err?.code === "ERR_BAD_RESPONSE" ||
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

  return (
    <>
      <CartPage
        isPageLoading={isCartLoading}
        initialCartItems={cartItem}
        onIncreamentQuantity={handleIncreament}
        ondecreamentQuantity={handleDecreament}
        isActionLoading={isActionLoading}
        onRemoveItem={handleRemoveItem}
        cart={cart}
      />
      <CompactProductGrid maxItems={4} showTitle={false} />
      <Footer />
    </>
  );
};

export default Cart;
