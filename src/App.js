// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CustomerView from "./customer/CustomerView.js";

export default function App() {
  return (
    <Router>
      <div className="overall">
        <Header />

        <div className="main full">
          <Routes>
            {/* Root path → Customer View */}
            <Route path="/" element={<CustomerView />} />

            {/* Optional alias */}
            <Route path="/customer" element={<CustomerView />} />

            {/* Catch-all: redirect everything to Customer View */}
            <Route path="*" element={<CustomerView />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
