import { Route, Routes } from "react-router-dom";
import AdminRouter from "./admin/Admin";
import { AppProvider } from "./context/AppContext";
import useAuthCheck from "./hooks/useAuthCheck";
import UserLayout from "./layout/UserLayout";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
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

const AppContent = () => {
  useAuthCheck(); 

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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
      </Route>
      <Route path="/admin/*" element={<AdminRouter />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ToastProvider>
  );
};


export default App;
