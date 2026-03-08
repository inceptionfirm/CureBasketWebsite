import React from "react";
import { Star } from "lucide-react";
import "./TestimonialsSection.css";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      text: "Excellent service! The prescription upload was so easy and my medicines were delivered the same day. Highly recommended!",
      author: "Sarah Johnson",
      role: "Customer",
      rating: 5,
    },
    {
      id: 2,
      text: "The doctor consultation feature is amazing. I got professional advice from licensed doctors without leaving my home.",
      author: "Michael Chen",
      role: "Customer",
      rating: 5,
    },
    {
      id: 3,
      text: "Great quality medicines at competitive prices. The insurance coverage makes it even more affordable.",
      author: "Emily Davis",
      role: "Customer",
      rating: 5,
    },
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="section-subtitle">
          Trusted by thousands of satisfied customers
        </p>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="author-info">
                  <h4>{testimonial.author}</h4>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
