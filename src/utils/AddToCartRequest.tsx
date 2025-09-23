import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import api from "./api";
import { useToast } from "./ToastNotification";
import type { Product } from "../context/AppContextInterface";

export const AddToCartRequest = () => {
  const { isAuthenticated, setIsAddToCartLoading, setCart } = useAppContext();
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

      setCart((prev) => {
        if (!prev) {
          return {
            _id: "temp-id",
            userId: "temp-user",
            items: listingIds.map((id) => ({
              product: { _id: id } as Product, 
              quantity: 1,
              price: 0, 
            })),
            total: 0, 
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          };
        }
        
        const newItems = listingIds
          .filter((id) => !prev.items.some((item) => item.product._id === id))
          .map((id) => ({
            product: { _id: id } as Product,
            quantity: 1,
            price: 0,
          }));
        return {
          ...prev,
          items: [...prev.items, ...newItems],
          updatedAt: new Date().toISOString(),
        };
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
