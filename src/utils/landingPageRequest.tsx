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
    setUserData,
    setCart,
  } = useAppContext();

  const toast = useToast();

const handleFetchAll = async () => {
  setIsLandingPageLoading(true);
  try {
    const token = localStorage.getItem("nexgad_token");

    if (token) {
      const [userRes, wishlistRes, productRes, categoryRes, cartRes] = await Promise.all([
        api.get("/user"),
        api.get("/wishlist/ids"),
        api.get("/product?page=1&limit=12"),
        api.get("/product/categories"),
        api.get("/cart")
      ]);

      const userData = userRes.data.data;
      const wishlistIds: string[] = wishlistRes.data.data.products ?? [];
      const products = productRes.data.data.products;
      const categories = categoryRes.data.data;
      const cart = cartRes.data.data

     
      localStorage.setItem("nexgad_user", JSON.stringify(userData));
      setWishlistProductIds(wishlistIds);
      setUserData(userData);
      setCart(cart)
      setIsAuthenticated(true);

      setListings(
        products.map((p: any) => ({ ...p, liked: wishlistIds.includes(p._id) }))
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
  } catch (err) {
    console.error(err);
    toast.error("", "An error occurred, try again later");
     window.dispatchEvent(new CustomEvent('network-error'));
  } finally {
    setIsLandingPageLoading(false);
  }
};

  return { handleFetchAll };
};
