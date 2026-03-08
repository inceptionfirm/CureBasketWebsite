import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import "./HeroCarousel.css";

const HeroCarousel = ({ banners = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  const placeholderSvg = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"><rect fill="#0F766E" width="1200" height="400"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="24">Cure Basket</text></svg>'
  );

  /** Always return a string for img src – handle Vite import (string or { default }) and any object with .src/.url */
  const getImgSrc = (url) => {
    const src = (url != null && typeof url === "string") ? url : (url?.default ?? url?.src ?? url?.url);
    if (src != null && typeof src === "string" && src.trim()) return src.trim();
    return placeholderSvg;
  };

  return (
    <section className="hero-carousel">
      <div className="carousel-container">
        <div
          className="carousel-slides"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => {
            const primaryBtn = banner.primaryButton ?? { text: "Shop Now", link: "/products" };
            const secondaryBtn = banner.secondaryButton ?? { text: "Learn More", link: "/about" };
            const imgSrc = getImgSrc(banner.image);
            return (
              <div
                key={`slide-${index}-${banner.id}`}
                className="carousel-slide"
                style={{
                  backgroundImage: imgSrc ? `url("${imgSrc}")` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={imgSrc}
                  alt={banner.title || `Banner ${index + 1}`}
                  className="slide-image"
                  loading={index === 0 ? "eager" : "lazy"}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const t = e.target;
                    if (t && t.src !== placeholderSvg) {
                      t.onerror = null;
                      t.src = placeholderSvg;
                    }
                  }}
                />
                <div className="slide-content">
                  <div className="container">
                    <h1 className="slide-title">
                      {banner.subtitle ? <span className="slide-subtitle">{banner.subtitle}</span> : null}
                      {banner.title}
                    </h1>
                    <p className="slide-description">{banner.description || ""}</p>
                    <div className="slide-actions">
                      <Link to={primaryBtn.link || "/products"} className="slide-btn slide-btn-primary">
                        {primaryBtn.text || "Shop Now"}
                        <ArrowRight size={14} />
                      </Link>
                      <Link to={secondaryBtn.link || "/about"} className="slide-btn slide-btn-secondary">
                        {secondaryBtn.text || "Learn More"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {banners.length > 1 && (
          <>
            <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
              <ChevronLeft size={24} />
            </button>
            <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
              <ChevronRight size={24} />
            </button>

            <div className="carousel-dots">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;
