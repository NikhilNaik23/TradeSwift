import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import useAuthStore from "../store/useAuthStore";
import SellerNavbar from "../components/Seller/SellerNavbar";
import BuyerNavbar from "../components/Buyer/BuyerNavbar";
const PublicLayout = () => {
  const user = useAuthStore((state) => state.user);
  
  return (
    <div className="min-h-screen flex flex-col">
      {!user ? (
        <PublicNavbar />
      ) : user.role === "seller" ? (
        <SellerNavbar />
      ) : (
        <BuyerNavbar />
      )}

      <main className="flex-grow">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
