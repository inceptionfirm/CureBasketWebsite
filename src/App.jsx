import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CartToast from './components/CartToast';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';
import './styles/notifications.css';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Products = React.lazy(() => import('./pages/Products'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Prescriptions = React.lazy(() => import('./pages/Prescriptions'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Account = React.lazy(() => import('./pages/Account/Account'));
const Blogs = React.lazy(() => import('./pages/Blogs'));
const Categories = React.lazy(() => import('./pages/Categories'));
const MedicineDetail = React.lazy(() => import('./pages/MedicineDetail'));
const BlogDetail = React.lazy(() => import('./pages/BlogDetail'));
const CategoryDetail = React.lazy(() => import('./pages/CategoryDetail'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const TermsOfSale = React.lazy(() => import('./pages/TermsOfSale'));
const HowToOrder = React.lazy(() => import('./pages/HowToOrder'));
const PrescriptionDrugs = React.lazy(() => import('./pages/PrescriptionDrugs'));
const OverTheCounter = React.lazy(() => import('./pages/OverTheCounter'));
const MedicalDirectory = React.lazy(() => import('./pages/MedicalDirectory'));
const Reviews = React.lazy(() => import('./pages/Reviews'));

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Header />
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/prescriptions" element={<Prescriptions />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/account" element={<Account />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:id" element={<CategoryDetail />} />
                <Route path="/medicine/:id" element={<MedicineDetail />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/terms-of-sale" element={<TermsOfSale />} />
                <Route path="/how-to-order" element={<HowToOrder />} />
                <Route path="/prescription-drugs" element={<PrescriptionDrugs />} />
                <Route path="/over-the-counter" element={<OverTheCounter />} />
                <Route path="/medical-directory" element={<MedicalDirectory />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <CartToast />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App
