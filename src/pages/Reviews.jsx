import React from "react";
import { Link } from "react-router-dom";
import { Star, Quote, ArrowLeft } from "lucide-react";
import "./Reviews.css";

const CURE_BASKET_REVIEWS = [
  { id: 1, text: "Cure Basket made getting my prescription refills so simple. Upload, order, done. Delivery was fast and the packaging was discreet. Will definitely use again.", author: "Jennifer M.", rating: 5 },
  { id: 2, text: "Best online pharmacy I've used. Prices are fair, customer service replied within hours, and my order arrived exactly when they said it would. Highly recommend Cure Basket.", author: "David R.", rating: 5 },
  { id: 3, text: "I was nervous about ordering meds online until I found Cure Basket. Secure, professional, and my doctor had no issues with the prescription process. Five stars.", author: "Patricia L.", rating: 5 },
  { id: 4, text: "Cure Basket saved me time and money. Same medications I was getting locally at a fraction of the cost. The re-order feature is a lifesaver.", author: "Robert K.", rating: 5 },
  { id: 5, text: "Outstanding experience from start to finish. Easy to navigate site, clear pricing, and my order was packed with care. Cure Basket has earned a loyal customer.", author: "Susan T.", rating: 5 },
  { id: 6, text: "Finally an online pharmacy that feels trustworthy. Verified products, transparent process, and they actually answer the phone when you have questions. Thank you, Cure Basket!", author: "James H.", rating: 5 },
  { id: 7, text: "I've recommended Cure Basket to my whole family. Reliable, affordable, and the prescription upload was straightforward. No more running to the pharmacy every month.", author: "Linda W.", rating: 5 },
  { id: 8, text: "Quick delivery, fair prices, and the medicines were exactly as described. Cure Basket is my go-to for prescription and OTC needs. Very satisfied.", author: "Michael P.", rating: 5 },
  { id: 9, text: "Professional service and genuine care for customers. Cure Basket helped me understand my options and get the best value. Will keep coming back.", author: "Nancy B.", rating: 5 },
  { id: 10, text: "Best decision switching to Cure Basket. My medications arrive on time every time, and the support team is helpful when I need to re-order or have a question.", author: "William C.", rating: 5 },
  { id: 11, text: "Cure Basket takes the stress out of managing prescriptions. Simple ordering, clear communication, and I feel confident in the quality. Excellent all around.", author: "Karen S.", rating: 5 },
];

const Reviews = () => {
  return (
    <div className="reviews-page">
      <div className="reviews-page-container">
        <Link to="/" className="reviews-back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <h1 className="reviews-page-title">What People Say About Cure Basket</h1>
        <p className="reviews-page-subtitle">Real reviews from our customers</p>
        <div className="reviews-page-grid">
          {CURE_BASKET_REVIEWS.map((review) => (
            <div key={review.id} className="reviews-page-card">
              <Quote className="reviews-page-quote" size={28} />
              <div className="reviews-page-rating">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p className="reviews-page-text">"{review.text}"</p>
              <span className="reviews-page-author">— {review.author}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
