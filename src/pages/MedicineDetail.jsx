import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import apiService from "../services/api";
import { useApp } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";
import "./MedicineDetail.css";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EMedicine%3C/text%3E%3C/svg%3E";

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  if (!children && children !== 0) return null;
  const content = typeof children === "string" ? children : (children?.props?.children ?? "");
  if (!content && !Array.isArray(children)) return null;
  return (
    <div className="medicine-accordion-item">
      <button
        type="button"
        className="medicine-accordion-head"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{title}</span>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {open && (
        <div className="medicine-accordion-body">
          {typeof children === "string" ? (
            <p className="medicine-accordion-text">{children}</p>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

const MedicineDetail = () => {
  const { id } = useParams();
  const { addToCart } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicine, setMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDosage, setSelectedDosage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    // Reset state when id changes so we never show previous medicine's content
    setMedicine(null);
    setError(null);
    setLoading(true);
    setQuantity(1);
    setSelectedDosage(null);
    setSelectedPackage(null);

    const fetchMedicine = async () => {
      if (!id || id === "undefined" || id === "null") {
        setError("Invalid medicine ID.");
        setLoading(false);
        return;
      }
      try {
        const res = await apiService.getPublicMedicineById(id);
        if (res.success && res.data) {
          setMedicine(res.data);
          const d = res.data;
          if (d.availableDosages?.[0]) {
            setSelectedDosage(d.availableDosages[0].strength || d.availableDosages[0].value);
            if (d.availableDosages[0].packages?.[0]) {
              setSelectedPackage(d.availableDosages[0].packages[0]);
            }
          }
        } else {
          setError("Medicine not found.");
        }
      } catch (err) {
        setError("Failed to load medicine details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

  const handleAddToCart = () => {
    if (medicine && (medicine.stock > 0 || medicine.inStock !== false)) {
      const item = selectedPackage
        ? { ...medicine, price: selectedPackage.totalPrice ?? medicine.price }
        : medicine;
      addToCart(item, quantity);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price ?? 0);

  if (loading) {
    return (
      <div className="medicine-detail-page">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="medicine-detail-page">
        <div className="container">
          <p className="detail-error">{error || "Medicine not found."}</p>
          <Link to="/products" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const inStock = medicine.stock > 0 || medicine.inStock !== false;
  const image = medicine.image && String(medicine.image).trim() ? medicine.image : PLACEHOLDER_IMAGE;
  const dosages = medicine.availableDosages || [];
  const currentDosageOption = dosages.find((d) => (d.strength || d.value) === selectedDosage);
  const packages = currentDosageOption?.packages || currentDosageOption?.sizes || [];
  const displayPrice = selectedPackage?.totalPrice ?? medicine.price;
  const displayOriginal = selectedPackage?.originalPrice ?? medicine.originalPrice;

  return (
    <div className="medicine-detail-page">
      <div className="container">
        <Link to="/products" className="detail-back-link">
          <ArrowLeft size={20} /> Back to Products
        </Link>

        {/* Breadcrumb */}
        {medicine.category && (
          <nav className="medicine-breadcrumb">
            <Link to="/categories">{medicine.category}</Link>
            <span className="breadcrumb-sep"> &gt; </span>
            <span>{medicine.name}</span>
          </nav>
        )}

        <div className="medicine-detail-layout">
          <div className="medicine-detail-image-wrap">
            <img
              src={image}
              alt={medicine.name || "Medicine"}
              className="medicine-detail-image"
              onError={(e) => {
                if (e.target.src !== PLACEHOLDER_IMAGE) e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
            {(medicine.originalPrice || displayOriginal) && (
              <span className="medicine-detail-discount-tag">
                Upto {medicine.discountPercent ?? 8}% OFF
              </span>
            )}
            <div className={`prescription-badge prescription-badge-inline ${medicine.prescriptionRequired ? 'prescription-yes' : 'prescription-no'}`}>
              <AlertTriangle size={16} /> Prescription required: {medicine.prescriptionRequired ? "Yes" : "No"}
            </div>
          </div>

          <div className="medicine-detail-content">
            <h1 className="medicine-detail-title">
              {medicine.name}
              {medicine.strength && ` ${medicine.strength}`}
            </h1>

            {/* Rating & Reviews */}
            {(medicine.rating > 0 || (medicine.reviewsCount ?? medicine.reviews) > 0) && (
              <div className="medicine-detail-rating">
                <div className="medicine-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(medicine.rating ?? 0) ? "filled" : ""}
                    />
                  ))}
                </div>
                <span className="medicine-reviews-count">
                  {medicine.reviewsCount ?? medicine.reviews ?? 0} Reviews
                </span>
              </div>
            )}

            {/* Price range or single price */}
            <div className="medicine-detail-price-wrap">
              <span className="medicine-detail-price">{formatPrice(displayPrice)}</span>
              {(displayOriginal || medicine.originalPrice) && (
                <span className="medicine-detail-original-price">
                  {formatPrice(displayOriginal || medicine.originalPrice)}
                </span>
              )}
              {packages.length > 1 && (
                <span className="medicine-price-range">
                  Price range: {formatPrice(Math.min(...packages.map((p) => p.totalPrice ?? p.price)))}
                  –{formatPrice(Math.max(...packages.map((p) => p.totalPrice ?? p.price)))}
                </span>
              )}
            </div>

            {/* Product details – all available fields */}
            <div className="medicine-key-info">
              <h3 className="medicine-dosages-heading">Product details</h3>
              {medicine.category && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">Category:</span>
                  <span className="medicine-key-value">{medicine.category}</span>
                </div>
              )}
              <div className="medicine-key-row">
                <span className="medicine-key-label">Prescription required:</span>
                <span className="medicine-key-value">{medicine.prescriptionRequired ? "Yes" : "No"}</span>
              </div>
              {(medicine.medicineForm || medicine.form) && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">Medicine form:</span>
                  <span className="medicine-key-value">{medicine.medicineForm || medicine.form}</span>
                </div>
              )}
              {medicine.manufacturer && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">Manufacturer:</span>
                  <span className="medicine-key-value">{medicine.manufacturer}</span>
                </div>
              )}
              {(medicine.countryOfOrigin != null && String(medicine.countryOfOrigin).trim() !== "") && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">Country of origin:</span>
                  <span className="medicine-key-value">{String(medicine.countryOfOrigin).trim()}</span>
                </div>
              )}
              {(medicine.barcode != null && String(medicine.barcode).trim() !== "") && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">Barcode:</span>
                  <span className="medicine-key-value">{medicine.barcode}</span>
                </div>
              )}
              {medicine.sku != null && String(medicine.sku).trim() !== "" && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">SKU:</span>
                  <span className="medicine-key-value">{medicine.sku}</span>
                </div>
              )}
              {(medicine.medicineSalt != null && String(medicine.medicineSalt).trim() !== "") && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">Salt:</span>
                  <span className="medicine-key-value">{medicine.medicineSalt}</span>
                </div>
              )}
              {(!medicine.medicineSalt || String(medicine.medicineSalt).trim() === "") && (medicine.activeIngredient || medicine.salt) && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">Salt:</span>
                  <span className="medicine-key-value">{medicine.activeIngredient || medicine.salt}</span>
                </div>
              )}
              {(medicine.genericName != null && String(medicine.genericName).trim() !== "") && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">Generic name:</span>
                  <span className="medicine-key-value">{medicine.genericName}</span>
                </div>
              )}
              {medicine.genericFor && medicine.genericFor !== medicine.genericName && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">Generic for:</span>
                  <span className="medicine-key-value">{medicine.genericFor}</span>
                </div>
              )}
              {medicine.status && (
                <div className="medicine-key-row">
                  <span className="medicine-key-label">Status:</span>
                  <span className="medicine-key-value">{String(medicine.status).toUpperCase()}</span>
                </div>
              )}
              <div className="medicine-key-row">
                <span className="medicine-key-label">Stock:</span>
                <span className="medicine-key-value">
                  {medicine.stock != null ? (medicine.stock > 0 ? `${medicine.stock} in stock` : "Out of stock") : "—"}
                </span>
              </div>
            </div>

            {/* Available Dosages */}
            {dosages.length > 0 && (
              <div className="medicine-dosages-section">
                <h3 className="medicine-dosages-heading">Available dosages</h3>
                <div className="medicine-dosage-tabs">
                  {dosages.map((d) => {
                    const val = d.strength || d.value || d.label;
                    return (
                      <button
                        key={val}
                        type="button"
                        className={`medicine-dosage-tab ${selectedDosage === val ? "active" : ""}`}
                        onClick={() => {
                          setSelectedDosage(val);
                          setSelectedPackage(d.packages?.[0] || d.sizes?.[0]);
                        }}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
                {packages.length > 0 && (
                  <div className="medicine-package-cards">
                    {packages.map((pkg, idx) => {
                      const total = pkg.totalPrice ?? pkg.price;
                      const perUnit = pkg.pricePerTablet ?? pkg.pricePerUnit ?? pkg.price;
                      const original = pkg.originalPrice ?? pkg.oldPrice;
                      const isSelected =
                        selectedPackage === pkg ||
                        (selectedPackage?.size === pkg.size && selectedPackage?.totalPrice === total);
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`medicine-package-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          <div className="package-size">
                            {pkg.size ?? pkg.quantity ?? pkg.label}{" "}
                            {pkg.unit || "Tablet/s"}
                          </div>
                          <div className="package-price-per">Price Per Tablet: {formatPrice(perUnit)}</div>
                          <div className="package-total">
                            Total Price: {formatPrice(total)}
                            {original && (
                              <span className="package-original"> {formatPrice(original)}</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="medicine-detail-actions-row">
              <div className="medicine-quantity-wrap">
                <label htmlFor="med-qty">Quantity:</label>
                <select
                  id="med-qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="medicine-quantity-select"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className={`btn btn-primary medicine-detail-add-cart ${!inStock ? "disabled" : ""}`}
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <ShoppingCart size={20} />
                ADD TO CART
              </button>
            </div>

          </div>
        </div>

        {/* Collapsible sections: Product Description, Precautions, Side Effects, How To Use, FAQs */}
        <div className="medicine-accordion">
          <CollapsibleSection title="Product Description" defaultOpen>
            {medicine.description || "No description available."}
          </CollapsibleSection>
          <CollapsibleSection title="Precautions">
            {medicine.precautions || "No precautions listed."}
          </CollapsibleSection>
          <CollapsibleSection title="Side Effects">
            {medicine.sideEffects || "No side effects listed."}
          </CollapsibleSection>
          <CollapsibleSection title="How To Use">
            {medicine.howToUse || "No usage instructions available."}
          </CollapsibleSection>
          <CollapsibleSection title="FAQs">
            {typeof medicine.faqs === "string"
              ? medicine.faqs
              : Array.isArray(medicine.faqs) && medicine.faqs.length > 0
                ? medicine.faqs.map((faq, i) => (
                    <div key={i} className="faq-item">
                      <strong>{faq.q || faq.question}</strong>
                      <p>{faq.a || faq.answer}</p>
                    </div>
                  ))
                : "No FAQs available."}
          </CollapsibleSection>
        </div>

        {/* Similar Products */}
        <section className="medicine-similar-section">
          <h2 className="medicine-similar-heading">Similar Products</h2>
          <p className="medicine-similar-hint">
            <Link to={`/products${medicine.category ? `?category=${medicine.categoryId ?? medicine.category}` : ""}`}>
              View more in {medicine.category || "Products"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default MedicineDetail;
