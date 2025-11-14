// frontend/src/components/Header.js
import React from "react";
import logo from "../assets/logo.png";
import "../components/Components.css";

function Header() {
  return (
    <div id="header">
      <div className="brand">
        <img src={logo} alt="USTP Logo" className="logo" />
        <h1>University of Science and Technology of Southern Philippines</h1>
      </div>
    </div>
  );
}

export default Header;
