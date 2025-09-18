import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import api from "./api";
import { useToast } from "./ToastNotification";

export const AddToWishlistRequest = () => {
  const { setListings, isAuthenticated, setIsListingLikeLoading } =
    useAppContext();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLikeListing = async (
    listingId: string,
    currentlyLiked: boolean
  ) => {
    setIsListingLikeLoading(true);
    if (!isAuthenticated) {
      toast.info("", "login to add a product to wishlist");
      navigate("/register");
      setIsListingLikeLoading(false);
      return;
    }

    if (currentlyLiked) {
      try {
        const data = { ids: [listingId] };
        await api.delete(`/wishlist`, { data });

        setListings((prev) =>
          prev.map((p) => (p._id === listingId ? { ...p, liked: false } : p))
        );
        toast.success("", "product removed from wishlist");
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
        setIsListingLikeLoading(false);
      }
    } else {
      try {
        await api.post(`/wishlist/${listingId}`);

        setListings((prev) =>
          prev.map((p) => (p._id === listingId ? { ...p, liked: true } : p))
        );
        toast.success("", "product added to wishlist");
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
        setIsListingLikeLoading(false);
      }
    }
  };

  return { handleLikeListing };
};
