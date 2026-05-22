import { createContext, useState, useContext, useEffect } from "react";
import { getProductById } from "../data/products";

const CART_STORAGE_KEY = "cart:v1";

function loadCartItems() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export const CartContext = createContext(undefined);

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCartItems);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore quota / private browsing errors
    }
  }, [cartItems]);

  function addToCart(productId) {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === productId);

      if (existingItem) {
        return items.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...items, { id: productId, quantity: 1 }];
    });
  }

  function getCartItemsWithProducts() {
    return cartItems
      .map((item) => ({
        ...item,
        product: getProductById(item.id),
      }))
      .filter((item) => item.product !== null);
  }

  function removeFromCart(productId) {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    // Verify inputs to updateQuantity to prevent non-numeric/non-integer values
    // that could cause NaN in getCartTotal. Validated inputs will safely call
    // either removeFromCart or setCartItems.
    const parsed = Number(quantity);
    if (!Number.isFinite(parsed)) {
      return;
    }
    const validatedQuantity = Math.floor(parsed);

    if (validatedQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((items) =>
      items.map((item) =>
        item.id === productId ? { ...item, quantity: validatedQuantity } : item,
      ),
    );
  }

  function getCartTotal() {
    return cartItems.reduce((total, item) => {
      const product = getProductById(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        getCartItemsWithProducts,
        updateQuantity,
        removeFromCart,
        getCartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
