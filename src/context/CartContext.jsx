// CartContext.jsx - Authentication context for the application

import { createContext, useState, useContext } from "react";
import { getProductById } from "../data/products";

// Create context
export const CartContext = createContext();

// Create provider component
export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // add cart function
  function addToCart(productId) {
    const existingItem = cartItems.find((item) => item.id === productId);

    if (existingItem) {
      const currentQuantity = existingItem.quantity;
      const updatedCartItems = cartItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: currentQuantity + 1 }
          : item,
      );

      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { id: productId, quantity: 1 }]);

    }
  }

  // function getCartItemsWithProducts
  function getCartItemsWithProducts() {
    return cartItems.map((item) => ({
      ...item,
      product: getProductById(item.id),
    })).filter(item => item.product !== null);
  }

  // remove cart function
  function removeFromCart(productId) {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  }

  // update Quantity function
  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  }

  function getCartTotal() {
    const total = cartItems.reduce(
      (total, item) => {
        const product = getProductById(item.id);
        return total + (product ? product.price * item.quantity : 0);
      }, 0
    );
    return total;
  }

  // clear cart function
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
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom Hook to use the CartContext
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within an CartProvider");
  }

  return context;
}
