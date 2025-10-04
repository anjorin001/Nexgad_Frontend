import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Status,
  type IGadgetRequest,
} from "../../components/gadgetRequestComponents/gadgetRequestInterface";
import api from "../../utils/api";
import { useToast } from "../../utils/ToastNotification";
import AdminGadgetRequestManagement from "../components/AdminRequestPage";

const GagdetRequest = () => {
  const [requests, setRequests] = useState<IGadgetRequest[]>();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [selectedRequest, setSelectedRequest] = useState<IGadgetRequest | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isViewMoreLoading, setIsViewMoreLoading] = useState<boolean>(false);
  const [isStatusChangingLoading, setIsStatusChangingLoading] = useState<
    string | null
  >(null);
  const [isToggleChatLoading, setIsToggleChatLoading] =
    useState<boolean>(false);
  const [isCreateOfferLoading, setIsCreateOfferLoading] =
    useState<boolean>(false);
  const [isCloseOfferLoading, setIsCloseOfferLoading] =
    useState<boolean>(false);
  const toast = useToast();

  const handleGetRequests = useCallback(async () => {
    setIsPageLoading(true);
    try {
      const queryParams: Record<string, any> = {
        ...(sortBy ? { sortBy } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      };

      const queryString = new URLSearchParams(queryParams).toString();
      const endpoint = queryString
        ? `/request/all?${queryString}`
        : "/request/all";

      console.log("enpoint", endpoint);

      const response = await api.get(endpoint);
      setRequests(response.data.data);
    } catch (err: any) {
      console.error("Error getting requests:", err);

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
  }, [sortBy, searchTerm, statusFilter]);

  useEffect(() => {
    handleGetRequests();
  }, [handleGetRequests]);

  const filteredRequests = useMemo(() => {
    return requests || [];
  }, [requests]);

  const handleInMemoryChangeStatus = (requestId: string, newStatus: Status) => {
    setRequests((prev) =>
      prev.map((req) =>
        req._id === requestId
          ? {
              ...req,
              status: newStatus,
              ...(newStatus === Status.IN_PROGRESS
                ? { chatEnabled: true }
                : {}),
            }
          : req
      )
    );
  };

  const handleStatusUpdate = async (requestId: string, newStatus: Status) => {
    if (!newStatus || !newStatus.trim()) return;

    setIsStatusChangingLoading(requestId);
    try {
      await api.patch(`/request/status/${requestId}`, { status: newStatus });
      handleInMemoryChangeStatus(requestId, newStatus);
    } catch (err: any) {
      console.error("Error updating status:", err);

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
      setIsStatusChangingLoading(null);
    }
  };

  const handleToggleChat = async (requestId: string, enabled: boolean) => {
    setIsToggleChatLoading(true);
    try {
      const request = await api.patch(`/request/${requestId}`);
      const chatEnabled: boolean = request?.data?.data?.chatEnabled;

      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, chatEnabled: chatEnabled } : req
        )
      );

      if (selectedRequest) {
        setSelectedRequest((p) => ({ ...p, chatEnabled: chatEnabled }));
      }
    } catch (err: any) {
      console.error("Error getting  listings:", err);

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
      setIsToggleChatLoading(false);
    }
  };

  const handleCreateOffer = async (requestId: string, priceValue: string) => {
    setIsCreateOfferLoading(true);
    const price = Number(priceValue);
    try {
      await api.post(`/request/create-offer/${requestId}`, { price });

      toast.info(
        "Payment Link has been successfully sent to customers email address"
      );

      handleInMemoryChangeStatus(requestId, Status.OFFER_MADE);
    } catch (err: any) {
      console.error("Error creating offer:", err);

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
      setIsCreateOfferLoading(false);
    }
  };

  const handleCloseOffer = async (requestId: string) => {
    setIsCloseOfferLoading(true);
    try {
      await api.post(`/request/close-offer/${requestId}`);

      toast.success("Offer closed successfully");

      handleInMemoryChangeStatus(requestId, Status.OFFER_DECLINED);
    } catch (err: any) {
      console.error("Error closing offer:", err);

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
      setIsCloseOfferLoading(false);
    }
  };

  const handleViewRequestDetail = async (requestId: string) => {
    setIsViewMoreLoading(true);
    try {
      const request = await api.get(`/request/${requestId}`);
      const response = request.data;

      setSelectedRequest(response);
    } catch (err: any) {
      console.error("Error getting request detail", err);

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
      setIsViewMoreLoading(false);
    }
  };

  return (
    <>
      <AdminGadgetRequestManagement
        isCloseOfferLoading={isCloseOfferLoading}
        isCreateOfferLoading={isCreateOfferLoading}
        isToggleChatLoading={isToggleChatLoading}
        filteredRequests={filteredRequests}
        isPageLoading={isPageLoading}
        isStatusChanging={isStatusChangingLoading}
        isViewMoreLoading={isViewMoreLoading}
        onChangeStatus={handleStatusUpdate}
        onCloseOffer={handleCloseOffer}
        onCreateOffer={handleCreateOffer}
        onSetSearchTerm={setSearchTerm}
        onSetSelectedRequestId={setSelectedRequestId}
        onSetSelectedRequest={setSelectedRequest}
        onSetSortBy={setSortBy}
        onSetStatusFilter={setStatusFilter}
        onToggleChat={handleToggleChat}
        onViewDetails={handleViewRequestDetail}
        requests={requests || []}
        searchTerm={searchTerm}
        selectedRequest={selectedRequest}
        selectedRequestId={selectedRequestId}
        sortBy={sortBy}
        statusFilter={statusFilter}
      />
    </>
  );
};

export default GagdetRequest;
