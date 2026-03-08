import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './CartToast.css';

const CartToast = () => {
  const { state } = useApp();
  const { cartToast } = state;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (cartToast) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [cartToast]);

  if (!cartToast) return null;

  const { itemName, quantity } = cartToast;
  const text = quantity > 1
    ? `Added to cart: ${itemName} × ${quantity}`
    : `Added to cart: ${itemName}`;

  return (
    <div
      className={`cart-toast ${show ? 'show' : ''}`}
      role="status"
      aria-live="polite"
    >
      <ShoppingCart size={20} />
      <span>{text}</span>
    </div>
  );
};

export default CartToast;
