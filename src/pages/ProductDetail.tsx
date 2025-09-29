import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductDetailCtn } from "../components/ProductDetail";
import type { IProduct } from "../components/productDetail/productDetailInterface";
import { useAppContext } from "../context/AppContext";
import { AddToCartRequest } from "../utils/AddToCartRequest";
import { AddToWishlistRequest } from "../utils/AddToWishlistRequest";
import api from "../utils/api";
import { useToast } from "../utils/ToastNotification";
import { extractProductId } from "../helper/idExtractor";

const ProductDetail = () => {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<IProduct>();
  const { isAddToCartLoading, isAuthenticated, isListingLikeLoading, setWishlistProductIds } =
    useAppContext();
  const { slug } = useParams();
  const toast = useToast();
  const productId = extractProductId(slug)

  const { handleLikeListing } = AddToWishlistRequest();
  const { handleAddToCart } = AddToCartRequest();

  const handleGetProductDetail = async () => {
    setIsPageLoading(true);

    if (isAuthenticated) {
      try {
        const [productRes, wishlistRes] = await Promise.all([
          api.get(`/product/${productId}`),
          api.get("/wishlist/ids"),
        ]);

        const wishlistIds: string[] = wishlistRes.data.data.products ?? [];
        setWishlistProductIds(wishlistIds)

        const response = productRes.data.data;

        setProduct({
          ...response,
          liked: wishlistIds.includes(response._id),
        });
      } catch (err: any) {
        console.error("Error occured:", err);

        if (err?.response?.data?.message) {
          toast.error(err.response.data.message);
        } else if (
          err?.code === "ERR_NETWORK" ||
          err?.code === "ECONNABORTED" ||
           err?.code === "ERR_BAD_RESPONSE" ||
          (err?.message && err.message.includes("Network Error"))
        ) {
          toast.error(
            "Network connection error. Please check your internet connection."
          );
          window.dispatchEvent(new CustomEvent("network-error"));
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsPageLoading(false);
      }
    } else {
      try {
        const productRes = await api.get(`/product/${productId}`);

        const response = productRes.data.data;

        setProduct({
          ...response,
          liked: false,
        });
      } catch (err: any) {
        console.error("Error occured:", err);

        if (err?.response?.data?.message) {
          toast.error(err.response.data.message);
        } else if (
          err?.code === "ERR_NETWORK" ||
          err?.code === "ECONNABORTED" ||
          err?.code === "ERR_BAD_RESPONSE" ||
          (err?.message && err.message.includes("Network Error"))
        ) {
          toast.error(
            "Network connection error. Please check your internet connection."
          );
          window.dispatchEvent(new CustomEvent("network-error"));
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsPageLoading(false);
      }
    }
  };

  useEffect(() => {
    handleGetProductDetail();
  }, [productId]);
  console.log("first");
  return (
    <ProductDetailCtn //TODO take th folloeing below away to productdeatilctn ... make use of useparams to get product id  and fetch product from db... the rest of the on props should make use of the id.
      isAddToCartLoading={isAddToCartLoading}
      isLikeLoading={isListingLikeLoading}
      isPageLoading={isPageLoading}
      product={product}
      onAddToCart={handleAddToCart}
      onAddToWishlist={handleLikeListing}
      onReportItem={(id) => console.log("Report item:", id)}
    />
  );
};

export default ProductDetail;
