import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import AuthProvider from "./context/AuthContect";
import ProductDetail from "./pages/ProductDetails";

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* Add a new route for product details*/}
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
