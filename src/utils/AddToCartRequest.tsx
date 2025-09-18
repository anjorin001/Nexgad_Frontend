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
    } catch (err: any) {
      console.error("Error sending reset token:", err);

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
      setIsAddToCartLoading([]);
    }
  };

  return { handleAddToCart };
};
