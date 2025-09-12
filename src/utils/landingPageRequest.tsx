import { useAppContext } from "../context/AppContext";
import api from "./api";
import { getUserRequest } from "./getUserRequest";
import { useToast } from "./ToastNotification";

export const useLandingPageRequest = () => {
  const {
    setIsLandingPageLoading,
    setLatestListings,
    setCategoryData,
  } = useAppContext();

  const toast = useToast();
  const { handleGetUser } = getUserRequest();

  const handleFetchAll = async () => {
    setIsLandingPageLoading(true);
    try {
      if (localStorage.getItem("token")) {
        handleGetUser();
      }
      const [productRes, categoryRes] = await Promise.all([
        api.get("/product?page=1&limit=12"),
        api.get("/product/categories"),
      ]);

      setLatestListings(productRes.data.data.products);
      setCategoryData(categoryRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error("", "An error occurred, try again later");
    } finally {
      setIsLandingPageLoading(false);
    }
  };

  return { handleFetchAll };
};
