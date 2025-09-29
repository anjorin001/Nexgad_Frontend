import qs from "qs";
import { useCallback, useEffect, useState } from "react";
import type { IProduct } from "../../components/productDetail/productDetailInterface";
import type { ProductCategory } from "../../enum/products.enum";
import api from "../../utils/api";
import { useToast } from "../../utils/ToastNotification";
import { GadgetManagement } from "../components/AdminGadegtManagement";

const Listings = () => {
  const [isDeleteLoading, setIsDeleteLoading] = useState<string>("");
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [viewProductLoading, setViewProductLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productDetail, setProductDetail] = useState<IProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const limit: number = 12;

  const toast = useToast();

  const handleGetProducts = useCallback(
    async (pageArg = page, search = searchTerm) => {
      setIsPageLoading(true);
      try {
        const queryParams: Record<string, any> = {
          page: pageArg,
          limit,
          ...(search ? { search } : {}),
        };

        const queryString = qs.stringify(queryParams);
        const res = await api.get(`/product?${queryString}`);

        const payload = res?.data?.data ?? res?.data ?? {};
        const productsData = payload?.products ?? [];
        const pagination = payload?.pagination ?? {};

        setProducts((prev = []) =>
          pageArg === 1 ? productsData : [...prev, ...productsData]
        );
        setHasMore(Boolean(pagination?.hasMore));
      } catch (err: any) {
        console.error("Error fetching products:", err);

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
    },
    [page, searchTerm, toast]
  );

  const handleDelete = async (productId: string) => {
    setIsDeleteLoading(productId);
    try {
      await api.delete(`/product/delete/${productId}`);
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err: any) {
      console.error("Error deleting product:", err);
      if (err.response) {
        toast.error(err.response.data.message || "Failed to delete product");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsDeleteLoading("");
    }
  };

  const handleSaveEdit = async (
    quantity: number,
    category: ProductCategory,
    productId: string
  ) => {
    setIsEditLoading(true);
    try {
      await api.patch(`/product/update/${productId}`, { quantity, category });
      toast.success("Product updated successfully");
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, quantity, category } : p
        )
      );
      return true;
    } catch (err: any) {
      console.error("Error updating product:", err);
      if (err.response) {
        toast.error(err.response.data.message || "Failed to update product");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleViewProductDetail = async (productId: string) => {
    setViewProductLoading(true);
    try {
      const res = await api.get(`/product/${productId}`);
      setProductDetail(res.data.data);
    } catch (err: any) {
      console.error("Error fetching product detail:", err);
      if (err.response) {
        toast.error(
          err.response.data.message || "Failed to fetch product details"
        );
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setViewProductLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (isPageLoading || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  const handleSearch = (search: string) => {
    if (!search.trim()) return;
    setSearchTerm(search);
    setPage(1);
    setProducts([]);
  };

  const handleClear = () => {
    setSearchTerm("");
    handleGetProducts(undefined, "");
  };

  useEffect(() => {
    handleGetProducts(page, searchTerm);
  }, [page]);

  useEffect(() => {
    if (searchTerm !== "") {
      const timeoutId = setTimeout(() => {
        setPage(1);
        setProducts([]);
        handleGetProducts(1, searchTerm);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setPage(1);
      setProducts([]);
      handleGetProducts(1, "");
    }
  }, [searchTerm]);

  return (
    <>
      <GadgetManagement
        isDeleteLoading={isDeleteLoading}
        isEditLoading={isEditLoading}
        isPageLoading={isPageLoading}
        onDelete={handleDelete}
        onSaveEdit={handleSaveEdit}
        onViewProductDetail={handleViewProductDetail}
        viewProductLoading={viewProductLoading}
        products={products}
        productDetail={productDetail}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onSearch={handleSearch}
        onclear={handleClear}
      />
    </>
  );
};

export default Listings;
