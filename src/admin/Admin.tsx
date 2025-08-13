import { Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Account from "./pages/Account";
import GagdetRequest from "./pages/GagdetRequest";
import Listings from "./pages/Listings";
import Oders from "./pages/Oders";
import DashBoard from "./pages/Overview";
import PromoDiscount from "./pages/PromoDiscount";
import Support from "./pages/Support";
import UploadGadget from "./pages/UploadGadget";

const AdminRouter = () => {
  return (
    <>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashBoard />} />
          <Route path="/upload" element={<UploadGadget />} />
          <Route path="/listing" element={<Listings />} />
          <Route path="/orders" element={<Oders />} />
          <Route path="/requests" element={<GagdetRequest />} />
          <Route path="/support" element={<Support />} />
          <Route path="/promotions" element={<PromoDiscount />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Routes>
    </>
  );
};

export default AdminRouter;
