import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import LensDetail from "./pages/LensDetail";
import Frames from "./pages/Frames";
import Lenses from "./pages/Lenses";
import Sunglasses from "./pages/Sunglasses";
import EyeExamBooking from "./pages/EyeExamBooking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import LoginPassword from "./pages/LoginPassword";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import ForgotPassword from "./pages/ForgotPassword";
import TradeIn from "./pages/TradeIn";
import BrandStories from "./pages/BrandStories";
import ChildrenGlasses from "./pages/ChildrenGlasses";
import BlueLightProtection from "./pages/BlueLightProtection";
import StoreLocator from "./pages/StoreLocator";
import Promotions from "./pages/Promotions";
import TrangChu2 from "./pages/TrangChu2";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/lenses/:id" element={<LensDetail />} />
        <Route path="/frames" element={<Frames />} />
        <Route path="/lenses" element={<Lenses />} />
        <Route path="/sunglasses" element={<Sunglasses />} />
        <Route path="/eye-exam" element={<EyeExamBooking />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-password" element={<LoginPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/trade-in" element={<TradeIn />} />
        <Route path="/brand-stories" element={<BrandStories />} />
        <Route path="/children-glasses" element={<ChildrenGlasses />} />
        <Route path="/blue-light-protection" element={<BlueLightProtection />} />
        <Route path="/store-locator" element={<StoreLocator />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/trangchu2" element={<TrangChu2 />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
