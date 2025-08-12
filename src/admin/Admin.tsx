import { Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import DashBoard from "./pages/Overview";
import UploadGadget from "./pages/UploadGadget";
import Listings from "./pages/Listings";
import Oders from "./pages/Oders";
import GagdetRequest from "./pages/GagdetRequest";
import Support from "./pages/Support";

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
        </Route>
      </Routes>
    </>
  );
};

export default AdminRouter;
