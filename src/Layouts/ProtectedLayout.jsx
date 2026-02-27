import { Outlet } from "react-router";
import Navbar from "../Components/Navbar/Navbar";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  );
}

