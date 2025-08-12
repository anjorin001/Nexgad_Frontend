import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={true}/>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
