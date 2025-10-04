import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import RequestGadgetComponent from "../components/GadgetRequest";
import type {
  IGadgetRequest,
  RequestFormData,
} from "../components/gadgetRequestComponents/gadgetRequestInterface";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../utils/ToastNotification";
import api from "../utils/api";

const GadgetRequest = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [newMessages, setNewMessages] = useState<Record<string, string>>({});
  const [requests, setRequests] = useState<IGadgetRequest[]>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAppContext();

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmitRequest = async (data: RequestFormData) => {
    setIsloading(true);

    const formData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0)
      ) {
        return;
      }
      formData[key] = value;
    });

    console.log(formData);

    try {
      const request = await api.post("/request", formData);
      setRequestId(request.data.data);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Error sending gadget request", err);

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
      setIsloading(false);
    }
  };

  //TODO 1. create handleGet request , ensure request are been render properly
  const handleGetRequests = async () => {
    setIsPageLoading(true);
    try {
      const request = await api.get("/request");
      const response = request.data;

      setRequests(response.data);
    } catch (error: any) {
      console.error("Error getting request", error);

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
      setIsPageLoading(false);
    }
  };

  //TODO once request are been renderend, mount full on chat integration

  const handleSendMessage = (requestId: string) => {
    const message = newMessages[requestId]?.trim();
    if (!message) return;

    // Here you would typically send the message to your backend
    console.log(`Sending message for request ${requestId}: ${message}`);

    // Clear the input
    setNewMessages({
      ...newMessages,
      [requestId]: "",
    });
  };

  const handleMessageChange = (requestId: string, value: string) => {
    setNewMessages({
      ...newMessages,
      [requestId]: value,
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    handleGetRequests();
  }, []);

  return (
    <>
      <RequestGadgetComponent
        isLoading={isLoading}
        isSubmitted={isSubmitted}
        requestId={requestId}
        onSubmitRequest={handleSubmitRequest}
        setIsSubmitted={() => setIsSubmitted(false)}
        onSendMessage={handleSendMessage}
        messages={newMessages}
        onMessageChange={handleMessageChange}
        requests={requests}
        isPageLoading={isPageLoading}
      />
      <Footer />
    </>
  );
};

export default GadgetRequest;
