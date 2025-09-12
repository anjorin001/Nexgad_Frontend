import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAppContext } from "../context/AppContext";

export default function UserLayout() {
  const { isAuthenticated, isLandingPageLoading } = useAppContext();
  const location = useLocation();

  const hideNavbarOn = ["/register", "/login"];

  const shouldShowNav = hideNavbarOn.includes(location.pathname);
  return (
    <div className="flex flex-col min-h-screen">
      {isLandingPageLoading || shouldShowNav ? "" : <Navbar isAuthenticated={isAuthenticated} />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
