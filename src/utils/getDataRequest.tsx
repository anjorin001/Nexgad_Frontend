import { useAppContext } from "../context/AppContext";
import api from "./api";
import { useToast } from "./ToastNotification";

export const getRequest = () => {
  const { setUserData, setIsAuthenticated, setWishlistProductIds } =
    useAppContext();

  const toast = useToast();

  const handleGetData = async () => {
    try {
      const [userRes, wishlistRes] = await Promise.all([
        api.get("/user"),
        api.get("/wishlist/ids"),
      ]);

      localStorage.setItem("nexgad_user", JSON.stringify(userRes.data.data));
      setWishlistProductIds(wishlistRes.data.data);
      setUserData(userRes.data.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      toast.error("", "An error occurred, try again later");
    }
  };

  return { handleGetData };
};
