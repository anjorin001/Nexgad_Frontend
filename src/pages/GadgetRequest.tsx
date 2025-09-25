import { Value } from "@radix-ui/react-select";
import { useState } from "react";
import Footer from "../components/Footer";
import RequestGadgetComponent from "../components/GadgetRequest";
import type { RequestFormData } from "../components/gadgetRequestComponents/gadgetRequestInterface";
import { useToast } from "../utils/ToastNotification";
import api from "../utils/api";

const GadgetRequest = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const toast = useToast();

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

    console.log(formData)
   
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
  return (
    <>
      <RequestGadgetComponent
        isLoading={isLoading}
        isSubmitted={isSubmitted}
        requestId={requestId}
        onSubmitRequest={handleSubmitRequest}
        setIsSubmitted={() => setIsSubmitted(false)}
      />
      <Footer />
    </>
  );
};

export default GadgetRequest;
