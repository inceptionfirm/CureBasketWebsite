import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import apiService from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import MedicineGrid from "../components/Medicine/MedicineGrid";
import "./CategoryDetail.css";

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(false);

  // Load all categories for dropdown
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiService.getPublicCategories(100);
        if (response.success && response.data) {
          const d = response.data;
          const list = Array.isArray(d) ? d : (d.categories ?? d.content ?? []);
          setCategories(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.warn("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setError("Invalid category ID.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await apiService.getPublicCategoryById(id);
        if (res.success && res.data) {
          setCategory(res.data);
        } else {
          setError("Category not found.");
        }
      } catch (err) {
        setError("Failed to load category.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  // Load medicines for current category (backend dosageForm filter + client-side by category name)
  const categoryName = category?.name || category?.categoryName || "";
  useEffect(() => {
    if (!categoryName) {
      setMedicines([]);
      return;
    }
    const loadMedicines = async () => {
      setMedicinesLoading(true);
      try {
        const response = await apiService.getPublicMedicines({
          dosageForm: categoryName,
          sortBy: "name",
        });
        let list = (response.success && response.data?.medicines) ? response.data.medicines : [];
        const nameLower = categoryName.trim().toLowerCase();
        const categoryIdStr = String(id);
        const matchesCategory = (med) =>
          (med.categoryId != null && String(med.categoryId) === categoryIdStr) ||
          (med.category && med.category.trim().toLowerCase() === nameLower) ||
          (med.form && med.form.trim().toLowerCase() === nameLower) ||
          (med.medicineForm && med.medicineForm.trim().toLowerCase() === nameLower);
        list = list.filter(matchesCategory);
        setMedicines(list);
      } catch (err) {
        console.error("Error loading medicines for category:", err);
        setMedicines([]);
      } finally {
        setMedicinesLoading(false);
      }
    };
    loadMedicines();
  }, [id, categoryName]);

  if (loading) {
    return (
      <div className="category-detail-page">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="category-detail-page">
        <div className="container">
          <p className="detail-error">{error || "Category not found."}</p>
          <Link to="/categories" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  const name = category.name || category.categoryName || "Category";
  const description = category.description || category.categoryDescription || "";
  const image =
    category.image ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='320'%3E%3Crect fill='%23f0f0f0' width='600' height='320'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='16'%3ECategory%3C/text%3E%3C/svg%3E";

  return (
    <div className="category-detail-page">
      <div className="container">
        <Link to="/categories" className="detail-back-link">
          <ArrowLeft size={20} /> Back to Categories
        </Link>

        {/* Dropdown: switch category */}
        {categories.length > 0 && (
          <div className="category-detail-filter">
            <label htmlFor="category-select" className="category-detail-filter-label">
              View category:
            </label>
            <select
              id="category-select"
              value={id}
              onChange={(e) => navigate(`/category/${e.target.value}`)}
              className="category-detail-select"
              aria-label="Select category"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="category-detail-layout">
          <div className="category-detail-image-wrap">
            <img
              src={image}
              alt={name}
              className="category-detail-image"
              loading="lazy"
            />
          </div>

          <div className="category-detail-content">
            <h1 className="category-detail-title">{name}</h1>
            {description && (
              <p className="category-detail-description">{description}</p>
            )}
            {category.status && (
              <p className="category-detail-status">
                Status: <strong>{String(category.status)}</strong>
              </p>
            )}
            {category.itemType && (
              <p className="category-detail-meta">Type: {String(category.itemType)}</p>
            )}
          </div>
        </div>

        {/* Medicines in this category */}
        <section className="category-detail-medicines">
          <h2 className="category-detail-medicines-title">
            Medicines in {name}
          </h2>
          {medicinesLoading ? (
            <LoadingSpinner />
          ) : (
            <MedicineGrid medicines={medicines} loading={medicinesLoading} />
          )}
        </section>
      </div>
    </div>
  );
};

export default CategoryDetail;
