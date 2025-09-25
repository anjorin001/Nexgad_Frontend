import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useToast } from "../../utils/ToastNotification";
import {
  ProductUploadForm,
  type ProductFormData,
} from "../components/AdminProductUpload";

const UploadGadget = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleUploadProduct = async (
    formData: ProductFormData
  ): Promise<boolean> => {
    setIsLoading(true);

    console.log(formData);

    const { images, ...rest } = formData;
    const fd = new FormData();

    images.forEach((img) => {
      if (img.file) {
        fd.append("images", img.file);
      }
    });

    Object.entries(rest).forEach(([key, value]) => {
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

      if (Array.isArray(value) || typeof value === "object") {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, String(value));
      }
    });

    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }

    try {
      await api.post("/product/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product uploaded successfully");

      return true;
    } catch (err: any) {
      console.error("Error sending reset token:", err);

      if (err.response) {
        if (err.response.message === "Unauthorized") {
          toast.error("Unauthorized Access");
          navigate("/login");
          return;
        }
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
      setIsLoading(false);
    }
  };

  return (
    <>
      <ProductUploadForm
        onUploadProduct={handleUploadProduct}
        isLoading={isLoading}
      />
    </>
  );
};

export default UploadGadget;
