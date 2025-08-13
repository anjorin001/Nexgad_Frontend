/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart3,
  CircleUser,
  Home,
  ImageUp,
  List,
  MessageCircle,
  Package,
  Settings,
  Smartphone,
  TrendingUp,
} from "lucide-react";

export const menuItems: any = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
    hasSubmenu: true,
    submenuItems: [
      { id: "overview", title: "Overview", icon: Home, url: "" },
      { id: "upload", title: "Upload Gadget", icon: ImageUp, url: "/upload" },
      { id: "listings", title: "Listings", icon: List, url: "/listing" },
    ],
  },
  {
    id: "orders",
    title: "Orders",
    icon: Package,
    hasSubmenu: true,
    submenuItems: [
      { id: "all-orders", title: "All Orders", icon: Package, url: "/orders" },
    ],
  },
  {
    id: "requests",
    title: "Gadget Requests",
    icon: Smartphone,
    hasSubmenu: true,
    submenuItems: [
      {
        id: "all-requests",
        title: "All Requests",
        icon: Smartphone,
        url: "/requests",
      },
    ],
  },
  {
    id: "communication",
    title: "Communication",
    icon: MessageCircle,
    hasSubmenu: true,
    submenuItems: [
      {
        id: "support",
        title: "Support Tickets",
        icon: Package,
        url: "/support",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    hasSubmenu: true,
    submenuItems: [
      {
        id: "promotions",
        title: "Promotions & Discounts",
        icon: TrendingUp,
        url: "/Promotions",
      },
      { id: "account", title: "Accounts", icon: CircleUser, url: "/account" },
    ],
  },
];
