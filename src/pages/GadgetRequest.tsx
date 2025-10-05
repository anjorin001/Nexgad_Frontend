import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import RequestGadgetComponent from "../components/GadgetRequest";
import type {
  IGadgetRequest,
  RequestFormData,
} from "../components/gadgetRequestComponents/gadgetRequestInterface";
import { useAppContext } from "../context/AppContext";
import { useChatMVP } from "../hooks/useChat";
import { useToast } from "../utils/ToastNotification";
import api from "../utils/api";

const GadgetRequest = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [newMessages, setNewMessages] = useState<Record<string, string>>({});
  const [requests, setRequests] = useState<IGadgetRequest[]>();
  const [selectedRequest, setSelectedRequest] = useState<IGadgetRequest>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAppContext();
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const {
    messages,
    sendMessage,
    loading,
    connection,
    updateMessageLocal,
    close,
    reconnect,
  } = useChatMVP(selectedRequest?._id);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const saved = await sendMessage(text.trim());
      updateMessageLocal(saved._id, { delivered: true });
      setText("");
    } catch (err: any) {
      console.error("send failed", err);

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
      setSending(false);
    }
  }

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
        onCloseConnection={() => {
          close();
          setSelectedRequest(null);
        }}
        isMessageLoading={loading}
        connectionStatus={connection}
        onSetSelectedRequest={setSelectedRequest}
        isLoading={isLoading}
        isSubmitted={isSubmitted}
        requestId={requestId}
        onSubmitRequest={handleSubmitRequest}
        setIsSubmitted={() => setIsSubmitted(false)}
        onSendMessage={handleSend}
        messages={messages}
        onMessageChange={setText}
        text={text}
        requests={requests}
        isPageLoading={isPageLoading}
        isSending={sending}
      />
      <Footer />
    </>
  );
};

export default GadgetRequest;
