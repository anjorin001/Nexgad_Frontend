import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminRouter from "./admin/Admin";
import { AdminProtector } from "./admin/AdminRoute";
import NexgadLoader from "./components/nexgad-loader";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./helper/ScrollToTop";
import useAuthCheck from "./hooks/useAuthCheck";
import UserLayout from "./layout/UserLayout";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ForgotPasswordFlow from "./pages/ForgetPassword";
import GadgetRequest from "./pages/GadgetRequest";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Login from "./pages/Login";
import Order from "./pages/Order";
import OrderDetail from "./pages/OrderDetail";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Support from "./pages/Support";
import Wishlist from "./pages/Wishlist";
import { ToastDemo, ToastProvider } from "./utils/ToastNotification";
import PaymentStatusPage from "./pages/PaymentStatus";

let hasVisited = false;
const AppContent = () => {
  const [showFirstLoader, setShowFirstLoader] = useState(!hasVisited);
  useAuthCheck();

  useEffect(() => {
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setShowFirstLoader(false);
        hasVisited = true;
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setShowFirstLoader(false);
    }
  }, []);

  if (showFirstLoader) {
    return (
      <div className="flex items-center justify-center h-screen">
        <NexgadLoader />
      </div>
    );
  }
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/userprofile" element={<Profile />} />
        <Route path="/listings/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/summary" element={<Checkout />} />
        <Route path="/my-orders" element={<Order />} />
        <Route path="/my-orders/:slug" element={<OrderDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/gadget-request" element={<GadgetRequest />} />
        <Route path="/support" element={<Support />} />
        <Route path="/toast" element={<ToastDemo />} />
        <Route path="/payment-clearance" element={<PaymentStatusPage />} />
      </Route>
      <Route
        path="/admin/*"
        element={
          <AdminProtector>
            <AdminRouter />
          </AdminProtector>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <ScrollToTop />
      <AppProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </AppProvider>
    </ToastProvider>
  );
};

export default App;
