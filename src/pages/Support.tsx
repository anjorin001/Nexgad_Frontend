import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import type { Order } from "../components/orderComponents/OrderInterfaces";
import { SupportPage } from "../components/support/SupportPage";
import type {
  SupportTicket,
  TicketFormData,
} from "../components/support/types";
import { useToast } from "../utils/ToastNotification";
import api from "../utils/api";

const Support = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>();
  const [isPageLoading, setIspageLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>();
  const toast = useToast();
  const recentOrdersLimit = 3;

  const handleSubmitTicket = async (ticketData: TicketFormData) => {
    try {
      const request = await api.post("/support/ticket", ticketData);
      const response = request.data;

      setTickets((prev) => [response.data, ...prev]);

      toast.success(
        "Ticket submitted successfully! We will get back to you soon."
      );

      return true;
    } catch (error: any) {
      console.error("Error submitting ticket", error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  const handleGetSupport = async () => {
    setIspageLoading(true);
    try {
      const [ticketsRes, ordersRes] = await Promise.all([
        api.get("/support/ticket/user"),
        api.get(`/order/recent?limit=${recentOrdersLimit}`),
      ]);

      const tickets = ticketsRes.data;
      const orders = ordersRes.data;

      setTickets(tickets.data);
      setOrders(orders.data);
    } catch (error: any) {
      console.error("Error submitting ticket", error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIspageLoading(false);
    }
  };

  useEffect(() => {
    handleGetSupport();
  }, []);

  return (
    <>
      <SupportPage
        isPageLoading={isPageLoading}
        onSubmitTicket={handleSubmitTicket}
        orders={orders}
        tickets={tickets}
      />
      <Footer />
    </>
  );
};

export default Support;
