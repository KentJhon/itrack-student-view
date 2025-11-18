import React, { useState, useEffect } from "react";
import "./CustomerView.css";
import { FiSearch } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import imagePlaceholder from "../assets/image.png"; // default fallback image

// 🔽 IMPORT YOUR ITEM PHOTOS FROM src/assets
import cartolinaRed from "../assets/products/cartolina_red.jpg";
import indexCardHalf from "../assets/products/index_card.jpg";
import yellowPaper from "../assets/products/yellow_paper.jpg";
import eraserDrawing from "../assets/products/eraser.jpg";
// ...import more as needed

// 🔽 MAP ITEM NAMES (from DB) → IMPORTED IMAGES
// Make sure these keys match EXACTLY the `name` field from /items
const imageMap = {
  "Cartolina U.S. (Red)": cartolinaRed,
  "Index Card veco brand 1/2": indexCardHalf,
  "Yellow Paper": yellowPaper,
  "Eraser Drawing": eraserDrawing,
  // add more mappings here
};

function CustomerView() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔽 Backend URL — LOCAL ONLY (no dev tunnel)
  // const API_BASE = "http://192.168.18.152:8000";
  const API_BASE = "https://itrack-backend-n9z9.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/items`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => (b.sold || 0) - (a.sold || 0));
        setProducts(sorted);
      })
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products
    .filter((item) => {
      const matchCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const name = (item.name || "").toString();
      const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) =>
      selectedCategory === "All" ? (b.sold || 0) - (a.sold || 0) : 0
    );

  return (
    <div className="customer-view">
      <Header />

      <div className="customer-content">
        {/* HEADER: Categories (LEFT) + Search (RIGHT) */}
        <div className="customer-header">
          <div
            className="customer-categories"
            role="tablist"
            aria-label="Product categories"
          >
            {categories.map((cat, i) => (
              <button
                key={i}
                className={selectedCategory === cat ? "active" : ""}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="customer-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
            />
            <FiSearch className="search-icon" aria-hidden="true" />
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="customer-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, i) => {
              // 🔽 choose image based on item.name (from DB)
              const imageSrc = imageMap[item.name] || imagePlaceholder;

              return (
                <div key={i} className="product-card">
                  <img
                    src={imageSrc}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = imagePlaceholder;
                    }}
                  />
                  <div className="product-body">
                    <h3>{item.name}</h3>
                    <div className="product-meta">
                      <span className="price">
                        ₱{Number(item.price || 0).toLocaleString()}
                      </span>
                      {item.sold ? (
                        <span className="sold">Sold: {item.sold}</span>
                      ) : (
                        <span className="sold">&nbsp;</span>
                      )}
                    </div>
                    <p className="stock">Stock: {item.stock_quantity ?? 0}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-products">
              No products found.
             
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CustomerView;
