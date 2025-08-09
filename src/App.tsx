import { Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Wishlist from "./pages/Wishlist";
import GadgetRequest from "./pages/GadgetRequest";
import OrderDetail from "./pages/OrderDetail";
import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <>
      <AppProvider>
        <Navbar isAuthenticated={true} />

        <div>
          <Routes>
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
          </Routes>
        </div>
      </AppProvider>
    </>
  );
};

export default App;
