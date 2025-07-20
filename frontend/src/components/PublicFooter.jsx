import React from "react";

const PublicFooter = () => {
  return (
    <footer className="bg-gray-100 text-center py-6 text-sm text-gray-500 mt-8">
      &copy; {new Date().getFullYear()} TradeSwift. All rights reserved.
    </footer>
  );
};

export default PublicFooter;
