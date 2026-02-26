import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
    id: number;
    name: string;
    price: number;
    image?: string;
    icon?: string;
    description: string;
}

interface WishlistStore {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: number) => void;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    if (state.items.find((i) => i.id === item.id)) {
                        return state;
                    }
                    return { items: [...state.items, item] };
                }),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
