import { useAppContext } from "../context/AppContext";
import api from "./api";
import { getRequest } from "./getDataRequest";
import { useToast } from "./ToastNotification";

export const useLandingPageRequest = () => {
  const {
    setIsLandingPageLoading,
    setListings,
    setCategoryData,
    wishlistProductIds,
    setWishlistProductIds,
    setIsAuthenticated,
    setUserData
  } = useAppContext();

  const toast = useToast();

const handleFetchAll = async () => {
  setIsLandingPageLoading(true);
  try {
    const token = localStorage.getItem("nexgad_token");

    if (token) {
      const [userRes, wishlistRes, productRes, categoryRes] = await Promise.all([
        api.get("/user"),
        api.get("/wishlist/ids"),
        api.get("/product?page=1&limit=12"),
        api.get("/product/categories"),
      ]);

      const userData = userRes.data.data;
      const wishlistIds: string[] = wishlistRes.data.data.products ?? [];
      const products = productRes.data.data.products;
      const categories = categoryRes.data.data;

     
      localStorage.setItem("nexgad_user", JSON.stringify(userData));
      setWishlistProductIds(wishlistIds);
      setUserData(userData);
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
  } finally {
    setIsLandingPageLoading(false);
  }
};

  return { handleFetchAll };
};
