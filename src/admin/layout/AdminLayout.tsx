import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/Navbar";
import { AdminSidebar } from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
