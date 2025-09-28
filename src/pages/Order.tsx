import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import OrdersPage from "../components/OrdersCtn";
import { useAppContext } from "../context/AppContext";
import api from "../utils/api";
import { useToast } from "../utils/ToastNotification";

const Order = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAppContext();
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  // const [isReorderLoading, setIsReorderLoading] = useState<string>("");
  // const { handleAddToCart } = AddToCartRequest();

  const handleGetOrders = async () => {
    setIsPageLoading(true);
    try {
      const request = await api.get(`/order?page=${page}&limit=${limit}`);
      const response = request.data;

      console.log("resps", response)

      setOrders((prev) => [...prev, ...response?.data]);

      setHasMore(Boolean(response?.pagination?.hasMore));
    } catch (err: any) {
      console.error("Error getting orders", err);

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
      setIsPageLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (isLoadMoreLoading || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("", "Login to access your orders");
      return;
    }

    handleGetOrders();
  }, []);

  return (
    <>
      <OrdersPage
        hasMore={hasMore}
        isLoadMoreLoading={isLoadMoreLoading}
        loadMore={handleLoadMore}
        allOrders={orders}
        isPageLoading={isPageLoading}
      />
      <Footer />
    </>
  );
};

export default Order;
