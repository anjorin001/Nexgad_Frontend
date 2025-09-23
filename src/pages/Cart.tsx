import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const cartItem = cart?.items || [];
  const navigate = useNavigate();
  const toast = useToast();

 const handleGetCart = async () => {
    setIsCartLoading(true);
    try {
      const request = await api.get("/cart");
      const response = request.data;

      const cart = response.data;

      setCart(cart);
    } catch (err) {
      console.error(err);
      toast.error(
        "",
        "An error occurred while adding to cart, try again later"
      );
      window.dispatchEvent(new CustomEvent("network-error"));
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleIncreament = async (listingId: string) => {
    setIsActionLoading(true);
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
      toast.error(
        "",
        err.response.data.message ||
          "An error occurred while adding to cart, try again later"
      );
      window.dispatchEvent(new CustomEvent("network-error"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDecreament = async (listingId: string) => {
    setIsActionLoading(true);
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
      toast.error(
        "",
        err.response.data.message ||
          "An error occurred while adding to cart, try again later"
      );
      window.dispatchEvent(new CustomEvent("network-error"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRemoveItem = async (
    listingId: string,
    safeForLater: boolean = false
  ) => {
    setIsActionLoading(true);
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
        toast.error(
          "",
          err.response.data.message ||
            "An error occurred while adding to cart, try again later"
        );
        window.dispatchEvent(new CustomEvent("network-error"));
      } finally {
        setIsActionLoading(false);
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
        toast.error(
          "",
          err.response.data.message ||
            "An error occurred while adding to cart, try again later"
        );
        window.dispatchEvent(new CustomEvent("network-error"));
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("", "Login to access your cart");
      return;
    }
    setCart(null)
    handleGetCart();
  }, []);

  //TODO   onListingLike: (listingId: string, currentlyLiked: boolean) => void;  // just create a moadl to diplay before user remove ---save for later and remove

  return (
    <>
      {isCartLoading ? (
        <Loader fullScreen={true} />
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
