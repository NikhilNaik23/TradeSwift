import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (item) => {
        const existing = get().cartItems.find((i) => i._id === item._id);
        if (!existing) {
          set((state) => ({
            cartItems: [...state.cartItems, item],
          }));
        }
      },

      removeFromCart: (itemId) =>
        set((state) => ({
          cartItems: () => {
            state.cartItems.filter((item) => {
              String(item._id) !== String(itemId);
            });
          },
        })),

      clearCart: () => set({ cartItems: [] }),

      setCartFromBackend: (items) => set({ cartItems: items }),
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
