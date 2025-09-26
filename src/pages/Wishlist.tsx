import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import WishlistPage from "../components/whishlist";
import { useAppContext } from "../context/AppContext";
import type { Product } from "../context/AppContextInterface";
import { useShareProduct } from "../hooks/useShareProduct";
import { AddToCartRequest } from "../utils/AddToCartRequest";
import api from "../utils/api";
import { slugifyProduct } from "../utils/Slugify";
import { useToast } from "../utils/ToastNotification";

const Wishlist = () => {
  const [isLoading, setIsLoading] = useState<string[]>([]);
  const [isWishlistLoading, setWishlistLoading] =useState<boolean>(false);
  const { handleAddToCart } = AddToCartRequest();
  const { handleShare } = useShareProduct();
  const {
    isAddToCartLoading,
    setWishlistItems,
    isAuthenticated,
    wishlistItems,
  } = useAppContext();
  const toast = useToast();
  const navigate = useNavigate();

  const handleGetWishlist = async () => {
    setWishlistLoading(true);
    try {
      const request = await api.get("/wishlist");
      const response = request.data;
      setWishlistItems(response.data.products);
    } catch (err: any) {
      console.error("Error getting wishlist", err);

      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      } else if (
        err.code === "ERR_NETWORK" ||
        err.code === "ECONNABORTED" ||
        err.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (id: string[]) => {
    setIsLoading(id);
    const data = {
      ids: id,
    };
    try {
      const request = await api.delete("/wishlist", { data });
      const response = request.data;
      setWishlistItems(response.data.products);
    } catch (err: any) {
      console.error("Error getting wishlist", err);

      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      } else if (
        err.code === "ERR_NETWORK" ||
        err.code === "ECONNABORTED" ||
        err.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsLoading([]);
    }
  };

  const handleClearWishlist = async () => {
    setWishlistLoading(true);

    try {
      await api.delete("/wishlist/clear");
      setWishlistItems([]);
    } catch (err: any) {
      console.error("Error getting wishlist", err);

      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      } else if (
        err.code === "ERR_NETWORK" ||
        err.code === "ECONNABORTED" ||
        err.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    setWishlistItems([]);
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("", "Login to access your wishlist items");
      return;
    }
    handleGetWishlist();
  },[]);

  const shareProduct = (e: React.MouseEvent, item: Product): void => {
    e.stopPropagation();
    const slug = slugifyProduct(item.title, item.productId);
    handleShare(item.productId, item.title, item.price, slug);
  };
  return (
    <>
      <WishlistPage
        isPageLoading={isWishlistLoading}
        Product={wishlistItems}
        isAddToCartLoading={isAddToCartLoading}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onClearWishlist={handleClearWishlist}
        onShare={shareProduct}
      />
      <Footer />
    </>
  );
};

export default Wishlist;
