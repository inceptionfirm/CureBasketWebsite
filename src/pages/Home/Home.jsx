import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import apiService from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import HeroCarousel from "./components/HeroCarousel";
import AboutPharmacySection from "./components/AboutPharmacySection";
import OverviewSection from "./components/OverviewSection";
import CategoriesSection from "./components/CategoriesSection";
import MedicinesSection from "./components/MedicinesSection";
import OffersSection from "./components/OffersSection";
import PrescriptionSection from "./components/PrescriptionSection";
import ConsultationSection from "./components/ConsultationSection";
import TestimonialsSection from "./components/TestimonialsSection";
import BlogSection from "./components/BlogSection";
import homeBanner from "../../assets/images/HomeBanner.jpg";
import { IMAGE_BASE_URL } from "../../config/apiConfig";
import "./Home.css";

const toFullImageUrl = (path) => {
  if (!path || typeof path !== "string") return null;
  const p = path.trim();
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const base = (IMAGE_BASE_URL || "https://api.curebasket.com").replace(/\/$/, "");
  return `${base}${p.startsWith("/") ? "" : "/"}${p}`;
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const toImgSrc = (v) => (v != null && typeof v === 'string') ? v : (v?.default ?? null);
  const getDefaultBanner = () => [
    {
      id: "1",
      image: toImgSrc(homeBanner) || homeBanner,
      title: "Your Trusted Healthcare Partner",
      subtitle: "Cure Basket",
      description:
        "Premium pharmaceutical products, prescription services, and healthcare solutions.",
      primaryButton: { text: "Shop Now", link: "/products" },
      secondaryButton: { text: "Upload Prescription", link: "/prescriptions" },
    },
  ];

  // Show one default banner; replace with API banner when loaded
  useEffect(() => {
    setBanners(getDefaultBanner());
  }, []);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // One banner: priority 1, latest created (backend image)
        try {
          const res = await apiService.getPublicPriority1Banner();
          const defaultImg = toImgSrc(homeBanner) || homeBanner;
          const defaultTitle = "Your Trusted Healthcare Partner";
          const defaultDesc = "Premium pharmaceutical products and prescription services.";
          if (res.success && res.data && !res.data._placeholder) {
            const b = res.data;
            const imageFromApi = b.image || b.imageUrl;
            const imageUrl =
              typeof imageFromApi === "string" && imageFromApi.trim()
                ? imageFromApi.trim()
                : toFullImageUrl(b.docPath || b.filePath || b.files?.[0]?.docPath || b.files?.[0]?.url) || defaultImg;
            setBanners([
              {
                id: b.id ?? "banner-1",
                image: imageUrl,
                title: (b.title || b.itemName || b.itemHeading || "").trim() || defaultTitle,
                subtitle: b.subtitle || "",
                description: (b.description || b.itemDescription || "").trim() || defaultDesc,
                primaryButton: { text: b.linkText || "Shop Now", link: b.linkUrl || "/products" },
                secondaryButton: { text: "Learn More", link: "/about" },
              },
            ]);
          }
        } catch (err) {
          console.warn("Error loading priority-1 banner, using default:", err);
        }

        // Load categories from API (same pattern as medicines: data.categories or data array)
        try {
          const categoriesResponse = await apiService.getPublicCategories(8);
          if (categoriesResponse.success && categoriesResponse.data) {
            const d = categoriesResponse.data;
            const apiCategories =
              d?.categories ??
              (Array.isArray(d) ? d : d?.content ?? []);
            setCategories(Array.isArray(apiCategories) ? apiCategories : []);
          } else {
            setCategories([]);
          }
        } catch (err) {
          setCategories([]);
        }

        // Load featured medicines from API (request extra so after ACTIVE filter we still get 6)
        try {
          const medicinesResponse = await apiService.getPublicMedicines({
            page: 0,
            size: 12,
            sortBy: "name",
          });
          if (medicinesResponse.success && medicinesResponse.data) {
            const apiMedicines = (medicinesResponse.data.medicines || []).slice(0, 6);
            setMedicines(apiMedicines);
          } else {
            setMedicines([]);
          }
        } catch (err) {
          setMedicines([]);
        }

        // Load all published blogs (pageSize 100 so we get all; show up to 6 on home section)
        try {
          const blogsResponse = await apiService.getPublicBlogs(100);
          if (blogsResponse.success && blogsResponse.data) {
            const d = blogsResponse.data;
            const list = Array.isArray(d) ? d : (d?.blogs ?? d?.content ?? []);
            setBlogs(Array.isArray(list) ? list : []);
          } else {
            setBlogs([]);
          }
        } catch (err) {
          setBlogs([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const carouselBanners = banners.length >= 1 ? banners : getDefaultBanner();

  return (
    <div className="home-page">
      {loading && (
        <div className="home-loading-overlay" aria-hidden="true">
          <LoadingSpinner />
        </div>
      )}
      <HeroCarousel banners={carouselBanners} />
      <AboutPharmacySection />
      <OverviewSection medicines={medicines} categories={categories} blogs={blogs} />
      <MedicinesSection medicines={medicines} loading={false} />
      <CategoriesSection categories={categories} />
      <BlogSection blogs={blogs} />
      <PrescriptionSection />
      <OffersSection />
      <ConsultationSection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;
