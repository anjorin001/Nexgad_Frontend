import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserLayout() {
  const location = useLocation();

  const hideNavbarOn = [];

  const shouldShowNav = hideNavbarOn.includes(location.pathname);
  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowNav ? "" : <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
