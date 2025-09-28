import { useAppContext } from "../context/AppContext";
import api from "./api";
import { useToast } from "./ToastNotification";

export const useLandingPageRequest = () => {
  const {
    setIsLandingPageLoading,
    setListings,
    setCategoryData,
    setWishlistProductIds,
    setIsAuthenticated,
    setCart,
    isAuthenticated
  } = useAppContext();

  const toast = useToast();

  const handleFetchAll = async () => {
    setIsLandingPageLoading(true);
    try {
      if (isAuthenticated) {
        const [wishlistRes, productRes, categoryRes, cartRes] =
          await Promise.all([
            api.get("/wishlist/ids"),
            api.get("/product?page=1&limit=12"),
            api.get("/product/categories"),
            api.get("/cart"),
          ]);

        const wishlistIds: string[] = wishlistRes.data.data.products ?? [];
        const products = productRes.data.data.products;
        const categories = categoryRes.data.data;
        const cart = cartRes.data.data;

        setWishlistProductIds(wishlistIds);
        setCart(cart);
        setIsAuthenticated(true);

        setListings(
          products.map((p: any) => ({
            ...p,
            liked: wishlistIds.includes(p._id),
          }))
        );
        setCategoryData(categories);
      } else {
        const [productRes, categoryRes] = await Promise.all([
          api.get("/product?page=1&limit=12"),
          api.get("/product/categories"),
        ]);
        const products = productRes.data.data.products;
        setListings(products.map((p: any) => ({ ...p, liked: false })));
        setCategoryData(categoryRes.data.data);
      }
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
      setIsLandingPageLoading(false);
    }
  };

  return { handleFetchAll };
};
