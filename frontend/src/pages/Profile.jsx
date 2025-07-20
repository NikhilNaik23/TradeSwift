import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      toast.error("Unable to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <div className="p-6 text-center text-gray-600">Loading...</div>;

  return (
    <motion.div
      className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4 mb-6">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
            {user.name[0]}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
        <div>
          <strong>Role:</strong> {user.role}
        </div>
        <div>
          <strong>Status:</strong>{" "}
          <span className={user.isActive ? "text-green-500" : "text-red-500"}>
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div>
          <strong>City:</strong> {user.address?.city}
        </div>
        <div>
          <strong>State:</strong> {user.address?.state}
        </div>
        <div>
          <strong>Country:</strong> {user.address?.country}
        </div>
        <div>
          <strong>Joined:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
