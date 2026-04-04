import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CSSScrollGlobal from "./components/layout/CSSScrollGlobal";
import "./animations.css";

// Lazy Loaded Pages
const Auth = lazy(() => import("./pages/auth"));
const Home = lazy(() => import("./pages/home"));
const Products = lazy(() => import("./pages/products"));
const ProductDetails = lazy(() => import("./pages/productdetails"));
const Cart = lazy(() => import("./pages/cart"));
const Checkout = lazy(() => import("./pages/checkout"));
const AddProduct = lazy(() => import("./components/admin/addproducts"));
const EditProduct = lazy(() => import("./components/admin/updateproducts"));
const DeleteProduct = lazy(() => import("./components/admin/productdelete"));
const AdminDashboard = lazy(() => import("./pages/admin/dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/products"));
const AdminOrders = lazy(() => import("./pages/admin/orders"));
const AdminCustomers = lazy(() => import("./pages/admin/customers"));
const ManageBanners = lazy(() => import("./components/admin/managebanners"));
const ManageCategories = lazy(() => import("./components/admin/managecategory"));
const AdminPayments = lazy(() => import("./pages/admin/payments"));
const AdminSettings = lazy(() => import("./pages/admin/settings"));
const AdminCredentials = lazy(() => import("./pages/admin/credentials"));
const Wishlist = lazy(() => import("./pages/wishlist"));
const Orders = lazy(() => import("./pages/orders"));
import AdminRoute from "./middleware/AdminRoute";

// ... Inside Routes ...
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
  </div>
);

import LoaderOverlay from "./components/layout/LoaderOverlay";

const App = () => {
  return (
    <BrowserRouter>
      <LoaderOverlay />
      <CSSScrollGlobal />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/register" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<Home />} />
          <Route path="/Product" element={<Products />} />
          <Route path="/category/:categoryId" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
          <Route path="/admin/deleteproducts" element={<AdminRoute><DeleteProduct /></AdminRoute>} />
          <Route path="/admin/banners" element={<AdminRoute><ManageBanners /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
          <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          <Route path="/admin/credentials" element={<AdminRoute><AdminCredentials /></AdminRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
