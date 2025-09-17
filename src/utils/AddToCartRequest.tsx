import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import api from "./api";
import { useToast } from "./ToastNotification";

export const AddToCartRequest = () => {
  const { isAuthenticated, setIsAddToCartLoading } = useAppContext();
  const navigate = useNavigate();
  const toast = useToast();

  const handleAddToCart = async (listingIds: string[]) => {
    setIsAddToCartLoading(listingIds);
    if (!isAuthenticated) {
      toast.info("", "login to add a product to cart");
      navigate("/register");
      setIsAddToCartLoading([]);
      return;
    }
    try {
      await api.post("/cart", {
        ids: listingIds,
      });
      toast.success("", "product added to cart");
    } catch (err) {
      console.error(err);
      toast.error(
        "",
        "An error occurred while adding to cart, try again later"
      );
    } finally {
      setIsAddToCartLoading([]);
    }
  };

  return { handleAddToCart };
};
