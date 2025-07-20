import React from "react";
import { Outlet } from "react-router-dom";
import BuyerNavbar from "../components/Buyer/BuyerNavbar";

const BuyerLayout = () => {
  return (
    <>
      <BuyerNavbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default BuyerLayout;
