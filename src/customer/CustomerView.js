import React, { useState, useEffect } from "react";
import "./CustomerView.css";
import { FiSearch } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import imagePlaceholder from "../assets/image.png"; // fallback image

// 📌 CATEGORY IMAGES
import imgStationery from "../assets/categories/stationery.png";
import imgGarments from "../assets/categories/garments.png";
import imgSouvenir from "../assets/categories/souvenir.png";
import imgBook from "../assets/categories/book.png";

// 📌 MAP CATEGORY → IMAGE
const categoryImageMap = {
  "Stationery": imgStationery,
  "Garments": imgGarments,
  "Souvenir": imgSouvenir,
  "Book": imgBook
};

function CustomerView() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // API_BASE = "http://localhost:8000";
  // const API_BASE = "http://192.168.18.152:8000";
  const API_BASE = "https://captsone-itrack.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/items`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => (b.sold || 0) - (a.sold || 0));
        setProducts(sorted);
      })
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // 📌 Get unique categories from DB
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  // 📌 Filtering logic
  const filteredProducts = products
    .filter((item) => {
      const matchCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch = item.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) =>
      selectedCategory === "All" ? (b.sold || 0) - (a.sold || 0) : 0
    );

  return (
    <div className="customer-view">
      <Header />

      <div className="customer-content">
        {/* HEADER: Categories + Search */}
        <div className="customer-header">
          <div className="customer-categories">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={selectedCategory === cat ? "active" : ""}
                onClick={() => setSelectedCategory(cat)}
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
            />
            <FiSearch className="search-icon" />
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="customer-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, i) => {
              // 📌 Choose image based on category
              const catImage = categoryImageMap[item.category] || imagePlaceholder;

              return (
                <div key={i} className="product-card">
                  <img
                    src={catImage}
                    alt={item.category}
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

                    <p className="stock">
                      Stock: {item.stock_quantity ?? 0}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-products">No products found.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CustomerView;