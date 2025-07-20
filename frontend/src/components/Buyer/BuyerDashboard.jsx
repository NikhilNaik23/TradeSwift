import React from "react";

const BuyerDashboard = () => {
  return (
    <>
      <section className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome, Buyer!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard title="Browse Products" link="/buyer/products" />
          <DashboardCard title="My Orders" link="/buyer/orders" />
        </div>
      </section>
    </>
  );
};

const DashboardCard = ({ title, link }) => (
  <a href={link} className="p-6 bg-gray-100 hover:bg-gray-200 rounded shadow">
    <h3 className="text-lg font-medium">{title}</h3>
  </a>
);

export default BuyerDashboard;
