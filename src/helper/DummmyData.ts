import type { Order, SupportTicket } from "../components/support/types";

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    productName: "iPhone 15 Pro",
    orderDate: "2024-08-10",
    status: "delivered",
    total: 999,
  },
  {
    id: "ORD-002",
    productName: "MacBook Air M2",
    orderDate: "2024-08-05",
    status: "shipped",
    total: 1299,
  },
  {
    id: "ORD-003",
    productName: "Samsung Galaxy Watch",
    orderDate: "2024-08-01",
    status: "delivered",
    total: 299,
  },
];

export const mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    orderId: "ORD-001",
    orderInfo: mockOrders[0],
    userId: "USER-456",
    category: "Damaged Item",
    description: "The iPhone arrived with a cracked screen",
    attachments: ["damage1.jpg", "damage2.jpg"],
    status: "in_progress",
    createdAt: "2024-08-11T10:00:00Z",
    updatedAt: "2024-08-11T10:00:00Z",
  },
  {
    id: "TKT-002",
    userId: "USER-456",
    category: "General Support",
    description: "Unable to access my account dashboard",
    attachments: [],
    status: "open",
    createdAt: "2024-08-10T15:30:00Z",
    updatedAt: "2024-08-10T15:30:00Z",
  },
];