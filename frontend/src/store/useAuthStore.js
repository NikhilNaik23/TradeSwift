import { create } from "zustand";
import api from "../utils/axios";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (userData) => set({ user: userData, loading: false }),

  fetchUser: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/auth/me", {
        withCredentials: true,
      });
      set({ user: res.data.user, loading: false });
    } catch (err) {
      set({ user: null, loading: false });
      console.log(err);
    }
  },

  logout: () => set({ user: null }),
}));

export default useAuthStore;
