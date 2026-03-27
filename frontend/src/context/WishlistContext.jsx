import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Determine storage key
  const storageKey = user ? `wishlist_${user.name}` : "wishlist_guest";

  // Load wishlist when storageKey changes (login/logout)
  useEffect(() => {
    const localWishlist = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setWishlistItems(localWishlist);
  }, [storageKey]);

  const toggleWishlist = (product) => {
    const updatedWishlist = [...wishlistItems];
    const index = updatedWishlist.findIndex(item => item._id === product._id);

    if (index !== -1) {
      // Remove if already exists
      updatedWishlist.splice(index, 1);
    } else {
      // Add if doesn't exist
      updatedWishlist.push(product);
    }

    setWishlistItems(updatedWishlist);
    localStorage.setItem(storageKey, JSON.stringify(updatedWishlist));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ 
        wishlistItems, 
        toggleWishlist, 
        isInWishlist,
        wishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
