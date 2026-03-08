import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiService from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import MedicineGrid from "../../components/Medicine/MedicineGrid";
import "./Products.css";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 0,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [inStock, setInStock] = useState(false);
  const [prescriptionRequired, setPrescriptionRequired] = useState(
    () => searchParams.get("prescription") || "all"
  );
  const [sortBy, setSortBy] = useState("name");

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiService.getPublicCategories(100);
        if (response.success && response.data) {
          setCategories(response.data.categories || []);
        }
      } catch (err) {
        console.warn("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Load medicines
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true);
        setError(null);

        // Do not pass size: API fetches ALL pages (no limit) so 1 lakh+ from backend all show
        const params = {
          active: true,
          ...(sortBy && { sortBy }),
          ...(searchQuery && { search: searchQuery }),
        };

        // Filter by category if selected
        if (selectedCategory !== "all") {
          const category = categories.find(
            (cat) => String(cat.id) === String(selectedCategory)
          );
          if (category) {
            params.dosageForm = category.name; // Use category name as form filter
          }
        }

        const response = await apiService.getPublicMedicines(params);

        if (response.success && response.data) {
          let filteredMedicines = response.data.medicines || [];

          // Filter by category on frontend (backend may not filter by dosageForm)
          if (selectedCategory !== "all") {
            const category = categories.find(
              (cat) => String(cat.id) === String(selectedCategory)
            );
            if (category) {
              const categoryNameLower = (category.name || "").trim().toLowerCase();
              const categoryIdStr = String(selectedCategory);
              filteredMedicines = filteredMedicines.filter((med) => {
                // Match by category ID if medicine has it
                if (med.categoryId != null && String(med.categoryId) === categoryIdStr) return true;
                // Match by category/form name (case-insensitive)
                const medCat = (med.category || med.form || med.medicineForm || "").trim().toLowerCase();
                return medCat === categoryNameLower;
              });
            }
          }

          // Apply frontend filters
          if (inStock) {
            filteredMedicines = filteredMedicines.filter(
              (med) => med.stock > 0
            );
          }

          if (prescriptionRequired !== "all") {
            filteredMedicines = filteredMedicines.filter(
              (med) =>
                prescriptionRequired === "yes"
                  ? med.prescriptionRequired === true
                  : med.prescriptionRequired === false
            );
          }

          setMedicines(filteredMedicines);
          setPagination(response.data.pagination || pagination);
        } else {
          setMedicines([]);
        }
      } catch (err) {
        console.error("Error loading medicines:", err);
        setError("Failed to load medicines. Please try again.");
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, [
    searchQuery,
    selectedCategory,
    inStock,
    prescriptionRequired,
    sortBy,
    pagination.page,
    pagination.pageSize,
    categories,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Medicines & Healthcare Products</h1>
          <p>Discover our comprehensive range of pharmaceutical products</p>
        </div>

        <div className="page-container products-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <h2>Filters</h2>

            {/* Search */}
            <div className="filter-section">
              <h3>Search</h3>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </form>
            </div>

            {/* Categories */}
            <div className="filter-section">
              <h3>Categories</h3>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div className="filter-section">
              <h3>Availability</h3>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Prescription */}
            <div className="filter-section">
              <h3>Prescription</h3>
              <select
                value={prescriptionRequired}
                onChange={(e) => {
                  setPrescriptionRequired(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="yes">Prescription Required</option>
                <option value="no">No Prescription</option>
              </select>
            </div>

            {/* Sort */}
            <div className="filter-section">
              <h3>Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="filter-select"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <p>
                    {medicines.length} medicine{medicines.length !== 1 ? "s" : ""}{" "}
                    found
                  </p>
                </div>
                <MedicineGrid medicines={medicines} loading={loading} />
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() =>
                        setPagination({ ...pagination, page: pagination.page - 1 })
                      }
                      disabled={pagination.page === 1}
                      className="pagination-btn"
                    >
                      Previous
                    </button>
                    <span>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPagination({ ...pagination, page: pagination.page + 1 })
                      }
                      disabled={pagination.page >= pagination.totalPages}
                      className="pagination-btn"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
