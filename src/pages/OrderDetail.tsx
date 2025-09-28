import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import {
  OrderStatus,
  type Order,
} from "../components/orderComponents/OrderInterfaces";
import OrderDetailComponent from "../components/OrderDetail";
import { useAppContext } from "../context/AppContext";
import api from "../utils/api";
import { useToast } from "../utils/ToastNotification";

const OrderDetail = () => {
  const [order, setOrder] = useState<any>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isCancelOrderLoading, setIsCancelOrderLoading] =
    useState<boolean>(false);
  const { isAuthenticated } = useAppContext();
  const toast = useToast();
  const { slug } = useParams();
  const navigate = useNavigate();
  const orderId = slug;
  console.log(slug)

  const handleGetOrderDetail = async () => {
    setIsPageLoading(true);

    try {
      const request = await api.get(`/order/${orderId}`);
      const response = request.data;
      setOrder(response.data);
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

  const handleCancelOrder = async (orderId: string) => {
    setIsCancelOrderLoading(true);

    try {
      await api.post(`/order/cancel/${orderId}`);

      setOrder((order) =>
        order ? { ...order, status: OrderStatus.CANCELLED } : order
      );
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
      setIsCancelOrderLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("", "Login to access your orders");
      return;
    }

    handleGetOrderDetail();
  }, []);

  return (
    <>
      <OrderDetailComponent
        isPageLoading={isPageLoading}
        onCancelOrder={handleCancelOrder}
        order={order}
        isCancelOrderLoading={isCancelOrderLoading}
      />
      <Footer />
    </>
  );
};

export default OrderDetail;
