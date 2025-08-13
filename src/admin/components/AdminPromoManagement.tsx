import React, { useState } from "react";
import type { PromoCode } from "./PromoCodeDiscount/types";
import { PageHeader } from "./PromoCodeDiscount/Header";
import { ActionBar } from "./PromoCodeDiscount/SearchFilter";
import { PromoTable } from "./PromoCodeDiscount/PromoTable";
import { CreatePromoDialog } from "./PromoCodeDiscount/CreatePromoDailogue";

export const AdminPromoManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    {
      id: "1",
      code: "SAVE2024",
      type: "percent",
      value: 15,
      startAt: "2024-08-01T09:00",
      endAt: "2024-12-31T23:59",
      maxRedemptions: 1000,
      currentRedemptions: 234,
      minOrderTotal: 10000,
      status: "active",
      applicableCategories: ["Smartphones & Tablets", "Laptops & Computers"],
      eligibilityRules: "newuser",
    },
    {
      id: "2",
      code: "FLASH500",
      type: "fixed",
      value: 5000,
      startAt: "2024-08-10T12:00",
      endAt: "2024-08-20T12:00",
      maxRedemptions: 100,
      currentRedemptions: 87,
      minOrderTotal: 25000,
      status: "active",
      applicableCategories: ["Gaming & Consoles", "Audio & Headphones"],
    },
    {
      id: "3",
      code: "WELCOME10",
      type: "percent",
      value: 10,
      startAt: "2024-07-15T00:00",
      endAt: "2024-09-15T23:59",
      maxRedemptions: 500,
      currentRedemptions: 156,
      minOrderTotal: 5000,
      status: "active",
      applicableCategories: [],
      eligibilityRules: "newuser",
    },
    {
      id: "4",
      code: "EXPIRED20",
      type: "percent",
      value: 20,
      startAt: "2024-06-01T00:00",
      endAt: "2024-07-31T23:59",
      maxRedemptions: 200,
      currentRedemptions: 200,
      minOrderTotal: 15000,
      status: "expired",
      applicableCategories: ["TV & Entertainment", "Home Appliances"],
    },
  ]);

  const handleCreatePromo = (
    newPromo: Omit<PromoCode, "id" | "currentRedemptions">
  ) => {
    const promo: PromoCode = {
      ...newPromo,
      id: Date.now().toString(),
      currentRedemptions: 0,
    };
    setPromoCodes((prev) => [promo, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#CBDCEB]/10 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        <ActionBar onCreateClick={() => setIsDialogOpen(true)} />
        <PromoTable promoCodes={promoCodes} />

        <CreatePromoDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleCreatePromo}
        />
      </div>
    </div>
  );
};

export default AdminPromoManagement;
