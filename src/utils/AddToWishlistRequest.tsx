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
      } catch (err) {
        console.error(err);
        toast.error(
          "",
          "An error occurred while removing from wishlist, try again later"
        );
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
      } catch (err) {
        console.error(err);
        toast.error(
          "",
          "An error occurred while adding to wishlist, try again later"
        );
      } finally {
        setIsListingLikeLoading(false);
      }
    }
  };

  return { handleLikeListing };
};
