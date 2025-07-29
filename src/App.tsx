import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AppProvider } from "./context/AppContext";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

const App = () => {
  return (
    <>
      <AppProvider>
        <Navbar />

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/userprofile" element={<Profile />} />
            <Route path="/listings/:slug" element={<ProductDetail />} />
          </Routes>
        </div>
      </AppProvider>
    </>
  );
};

export default App;
