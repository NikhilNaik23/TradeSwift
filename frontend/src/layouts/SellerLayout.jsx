import React from "react";
import { Outlet } from "react-router-dom";
import SellerNavbar from "../components/Seller/SellerNavbar";
import useAuthStore from "../store/useAuthStore";

const SellerLayout = () => {
  const user = useAuthStore((state) => state.user);

  if (!user || user.role !== "seller") {
    return <p className="text-center mt-10">Unauthorized Access</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SellerNavbar />
      <div className="flex flex-1">
        {/* Sidebar if you want one */}
        {/* <Sidebar /> */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
