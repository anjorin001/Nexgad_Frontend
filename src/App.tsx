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
            <Route path="/my-orders" element={<Order />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>
      </AppProvider>
    </>
  );
};

export default App;
