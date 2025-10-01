import React, { useEffect, useState } from "react";
import Loader from "../../components/nexgadMidPageLoader";
import api from "../../utils/api";
import { useToast } from "../../utils/ToastNotification";
import { CreatePromoDialog } from "./PromoCodeDiscount/CreatePromoDailogue";
import { DeletePromoModal } from "./PromoCodeDiscount/deleteModal";
import { ViewPromoDetailModal } from "./PromoCodeDiscount/detailModal";
import { PageHeader } from "./PromoCodeDiscount/Header";
import { PromoTable } from "./PromoCodeDiscount/PromoTable";
import { ActionBar } from "./PromoCodeDiscount/SearchFilter";
import type { PromoCode } from "./PromoCodeDiscount/types";

export const AdminPromoManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [filteredPromoCodes, setFilteredPromoCodes] = useState<PromoCode[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [promoDetail, setPromoDetail] = useState<PromoCode | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isVeiwMoreLoading, setIsViewMoreloading] = useState<boolean>(false);
  const [isPageLoading, setIspageLoading] = useState<boolean>(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);
  const [isCreatePromoLoading, setIsCreatePromoLoading] =
    useState<boolean>(false);
  const [isToggleStatusLoading, setIsToggleStatusLoading] =
    useState<boolean>(false);
  const [isDeletePromoLoading, setIsDeletePromoLoading] =
    useState<boolean>(false);
  const toast = useToast();

  const handleGetPromo = async () => {
    setIspageLoading(true);

    try {
      const request = await api.get("/promo-code");
      const response = request.data;

      setPromoCodes(response.data);
    } catch (error: any) {
      console.error("Error getting promo", error);

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

  const handleCreatePromo = async (
    newPromo: Omit<PromoCode, "id" | "currentRedemptions">
  ) => {
    setIsCreatePromoLoading(true);

    try {
      const request = await api.post("/promo-code/create", newPromo);
      const response = request.data;

      console.log("respone", response.data)
      toast.success("promo created successfully");
      setPromoCodes((prev) => [...prev, response.data]);
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating promo", error);

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
      setIsCreatePromoLoading(false);
    }
  };

  const handleDeletePromo = async (promoId: string) => {
    setIsDeletePromoLoading(true);

    try {
      await api.delete(`/promo-code/${promoId}`);

      setPromoCodes((prev) => prev.filter((p) => p._id !== promoId));
    } catch (error: any) {
      console.error("Error deleting promo", error);

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
      setIsDeletePromoLoading(false);
    }
  };

  const handleGetPromoDetail = async (promoId: string) => {
    setIsViewMoreloading(true);

    try {
      const request = await api.get(`/promo-code/${promoId}`);
      const response = request.data;

      setPromoDetail(response.data);
    } catch (error: any) {
      console.error("Error getting promo", error);

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
      setIsViewMoreloading(false);
    }
  };

  const handleTogglePromoStatus = async (promoId: string) => {
    setIsToggleStatusLoading(true);

    try {
      const request = await api.patch(`/promo-code/${promoId}`);
      const response = request.data;
      const status = response.data.status;

      console.log(response);

      setPromoCodes((prev) =>
        prev.map((p) => (p._id === promoId ? { ...p, status } : p))
      );
    } catch (error: any) {
      console.error("Error toggling status", error);

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
      setIsToggleStatusLoading(false);
    }
  };

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);

    if (!searchValue.trim()) {
      setFilteredPromoCodes(promoCodes);
      return;
    }

    const filtered = promoCodes.filter((promo) => {
      const searchLower = searchValue.toLowerCase();
      return (
        promo.code.toLowerCase().includes(searchLower) ||
        promo.status.toLowerCase().includes(searchLower)
      );
    });

    setFilteredPromoCodes(filtered);
  };

  useEffect(() => {
    handleGetPromo();
  }, []);

  useEffect(() => {
    setFilteredPromoCodes(promoCodes);
  }, [promoCodes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#CBDCEB]/10 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader promoCount={filteredPromoCodes.length} />
        <ActionBar
          onCreateClick={() => setIsDialogOpen(true)}
          onSearch={handleSearch}
        />

        {isPageLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader size={64} thickness={1} />
          </div>
        ) : filteredPromoCodes.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-12">
            No Promo codes available create one
          </div>
        ) : (
          <PromoTable
            promoCodes={filteredPromoCodes}
            onVeiwPromoDetail={(promo: PromoCode) => {
              setSelectedPromo(promo);
              handleGetPromoDetail(promo._id);
              setIsDetailModalOpen(true);
            }}
            openPromoDeleteModal={(promo: PromoCode) => {
              setSelectedPromo(promo);
              setIsDeleteModalOpen(true);
            }}
          />
        )}

        <CreatePromoDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleCreatePromo}
        />

        <DeletePromoModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPromo(null);
          }}
          onConfirm={async () => {
            await handleDeletePromo(selectedPromo._id);
            setIsDeleteModalOpen(false);
          }}
          promoCode={selectedPromo?.code}
          isLoading={isDeletePromoLoading}
        />

        <ViewPromoDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedPromo(null);
          }}
          isVeiwMoreLoading={isVeiwMoreLoading}
          promoCode={promoDetail}
          onToggleStatus={async () => {
            await handleTogglePromoStatus(selectedPromo._id);
          }}
          isStatusUpdating={isToggleStatusLoading}
        />
      </div>
    </div>
  );
};

export default AdminPromoManagement;
