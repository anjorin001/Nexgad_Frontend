import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages (adjust paths if needed)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";

const App = () => {
  return (
    <>
      <Navbar />

      {/* Main content below navbar */}
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings" element={<Listings />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
