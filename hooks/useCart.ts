import { useCartStore } from '@/store/cartStore';

/**
 * Custom hook for cart operations
 */
export function useCart() {
    const items = useCartStore(state => state.items);
    const addItem = useCartStore(state => state.addItem);
    const removeItem = useCartStore(state => state.removeItem);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const clearCart = useCartStore(state => state.clearCart);
    const getTotal = useCartStore(state => state.getTotal);
    const getItemCount = useCartStore(state => state.getItemCount);

    return {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total: getTotal(),
        itemCount: getItemCount(),
    };
}
