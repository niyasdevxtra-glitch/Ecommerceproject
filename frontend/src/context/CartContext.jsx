import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, isLoggedIn } = useAuth();

  useEffect(() => {
    if (token) {
        fetchCart();
    } else {
        const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCartItems(localCart);
    }
  }, [token]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await API.get("/cart");
      if (res.data.success && res.data.cart) {
        // Map backend 'product' to frontend expected 'productId'
        const items = (res.data.cart.items || []).map(item => ({
            ...item,
            productId: item.product // backend uses .product after population
        }));
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      if (error?.response?.status === 404 || error?.response?.status === 401) {
          setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCartResponse = (res) => {
    if (res.data.success && res.data.cart) {
      const items = (res.data.cart.items || []).map(item => ({
          ...item,
          productId: item.product
      }));
      setCartItems(items);
    }
  };

  const addToCart = async (product, quantity = 1, openCart = true, shippingMethod = 'Standard') => {
    if (token) {
      try {
        const res = await API.post("/cart", { productid: product._id, quantity, shippingMethod });
        if (res.data.success) {
          handleCartResponse(res);
          if (openCart) setIsCartOpen(true);
        }
      } catch (error) {
        // Silently catch in production or log securely
        console.error("CartContext: addToCart Error:", error);
      }
    } else {
      handleGuestAdd(product, quantity, openCart, shippingMethod);
    }
  };

  const handleGuestAdd = (product, quantity, openCart = true, shippingMethod = 'Standard') => {
      const updatedCart = [...cartItems];
      const existingIndex = updatedCart.findIndex(item => {
          const id = item.productId?._id || item.productId;
          return id === product._id;
      });

      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity += quantity;
        if (shippingMethod === 'Express') updatedCart[existingIndex].shippingMethod = 'Express';
      } else {
        updatedCart.push({ productId: product, quantity, shippingMethod });
      }
      setCartItems(updatedCart);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      if (openCart) setIsCartOpen(true);
  };

  const removeFromCart = async (productId) => {
    if (token) {
      try {
        const res = await API.delete("/cart", { data: { productid: productId } });
        handleCartResponse(res);
      } catch (error) {
        console.error("CartContext: removeFromCart Error:", error);
      }
    } else {
      const updatedCart = cartItems.filter(item => {
          const id = item.productId?._id || item.productId;
          return id !== productId;
      });
      setCartItems(updatedCart);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  const updateQuantity = async (productId, quantity) => {
      if (quantity < 1) return removeFromCart(productId);
      
      if (token) {
          try {
              const res = await API.put("/cart", { productid: productId, quantity });
              handleCartResponse(res);
          } catch (error) {
              console.error("CartContext: updateQuantity Error:", error);
          }
      } else {
          const updatedCart = [...cartItems];
          const item = updatedCart.find(item => {
              const id = item.productId?._id || item.productId;
              return id === productId;
          });

          if (item) {
              item.quantity = quantity;
              setCartItems(updatedCart);
              localStorage.setItem("guestCart", JSON.stringify(updatedCart));
          }
      }
  };
  
  const clearCart = async () => {
      if (token) {
          try {
              // This endpoint might not exist, but we can clear the frontend state at minimum
              // If the backend /cart DELETE with no body clears the whole cart, use that.
              // Otherwise, just clear the local state.
              setCartItems([]);
          } catch (error) {
              console.error("CartContext: clearCart Error:", error);
          }
      } else {
          setCartItems([]);
          localStorage.removeItem("guestCart");
      }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item?.productId?.price || 0;
    const qty = item?.quantity || 0;
    return acc + (price * qty);
  }, 0);

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        isCartOpen, 
        setIsCartOpen, 
        addToCart, 
        removeFromCart, 
        updateQuantity,
        clearCart,
        loading,
        cartCount,
        cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
