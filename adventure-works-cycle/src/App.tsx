import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Home from "@/pages/Home";
import DealsPage from "@/pages/DealsPage";
import NewArrivalsPage from "@/pages/NewArrivalsPage";
import Packages from "@/pages/Packages";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import Footer from "@/components/Footer";

export default function App() {
  const [openCart, setOpenCart] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col">
      <Navbar onOpenCart={() => setOpenCart(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>

      <Footer />

      {/* Drawer del carrito */}
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </div>
  );
}
