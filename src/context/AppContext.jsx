import React, { createContext, useContext, useReducer, useEffect } from 'react';
import siteConfig from '../config/site';
import apiService from '../services/api';
import { mergeCartByMedicineId } from '../services/api/cartApi';

// Initial state
const initialState = {
  // User state
  user: null,
  isAuthenticated: false,
  
  // Cart state
  cart: [],
  cartCount: 0,
  
  // Favorites state
  favorites: [],
  favoritesCount: 0,
  
  // Products state
  products: [],
  categories: [],
  featuredProducts: [],
  
  // UI state
  loading: false,
  error: null,
  cartToast: null, // { itemName, quantity } – shown when item added to cart
  
  // Search and filters
  searchQuery: '',
  filters: {
    category: 'all',
    priceRange: [0, 1000],
    inStock: true,
    prescription: 'all'
  },
  
  // Prescription state
  prescriptions: [],
  
  // Site configuration
  siteConfig: siteConfig
};

// Action types
export const actionTypes = {
  // User actions
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  
  // Cart actions
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_CART: 'SET_CART',
  
  // Favorites actions
  ADD_TO_FAVORITES: 'ADD_TO_FAVORITES',
  REMOVE_FROM_FAVORITES: 'REMOVE_FROM_FAVORITES',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  CLEAR_FAVORITES: 'CLEAR_FAVORITES',
  
  // Products actions
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_FEATURED_PRODUCTS: 'SET_FEATURED_PRODUCTS',
  
  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SHOW_CART_TOAST: 'SHOW_CART_TOAST',
  HIDE_CART_TOAST: 'HIDE_CART_TOAST',
  
  // Search and filter actions
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  
  // Prescription actions
  SET_PRESCRIPTIONS: 'SET_PRESCRIPTIONS',
  ADD_PRESCRIPTION: 'ADD_PRESCRIPTION'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      };
      
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
        cartCount: 0,
        favorites: [],
        favoritesCount: 0
      };
      
    case actionTypes.ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        const updatedCart = state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
        return {
          ...state,
          cart: updatedCart,
          cartCount: updatedCart.reduce((total, item) => total + item.quantity, 0)
        };
      } else {
        const newCart = [...state.cart, { ...action.payload, quantity: action.payload.quantity || 1 }];
        return {
          ...state,
          cart: newCart,
          cartCount: newCart.reduce((total, item) => total + item.quantity, 0)
        };
      }
      
    case actionTypes.REMOVE_FROM_CART:
      const filteredCart = state.cart.filter(item => item.id !== action.payload);
      return {
        ...state,
        cart: filteredCart,
        cartCount: filteredCart.reduce((total, item) => total + item.quantity, 0)
      };
      
    case actionTypes.UPDATE_CART_ITEM:
      const updatedCart = state.cart.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        cart: updatedCart,
        cartCount: updatedCart.reduce((total, item) => total + item.quantity, 0)
      };
      
    case actionTypes.CLEAR_CART:
      return {
        ...state,
        cart: [],
        cartCount: 0
      };

    case actionTypes.SET_CART:
      const cartList = Array.isArray(action.payload) ? action.payload : [];
      const cartCount = cartList.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
      return {
        ...state,
        cart: cartList,
        cartCount
      };
      
    case actionTypes.ADD_TO_FAVORITES:
      const existingFavorite = state.favorites.find(item => item.id === action.payload.id);
      if (existingFavorite) {
        return state; // Already in favorites
      }
      const newFavorites = [...state.favorites, action.payload];
      return {
        ...state,
        favorites: newFavorites,
        favoritesCount: newFavorites.length
      };
      
    case actionTypes.REMOVE_FROM_FAVORITES:
      const filteredFavorites = state.favorites.filter(item => item.id !== action.payload);
      return {
        ...state,
        favorites: filteredFavorites,
        favoritesCount: filteredFavorites.length
      };
      
    case actionTypes.TOGGLE_FAVORITE:
      const isFavorite = state.favorites.find(item => item.id === action.payload.id);
      if (isFavorite) {
        const updatedFavorites = state.favorites.filter(item => item.id !== action.payload.id);
        return {
          ...state,
          favorites: updatedFavorites,
          favoritesCount: updatedFavorites.length
        };
      } else {
        const updatedFavorites = [...state.favorites, action.payload];
        return {
          ...state,
          favorites: updatedFavorites,
          favoritesCount: updatedFavorites.length
        };
      }
      
    case actionTypes.CLEAR_FAVORITES:
      return {
        ...state,
        favorites: [],
        favoritesCount: 0
      };
      
    case actionTypes.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload
      };
      
    case actionTypes.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
      
    case actionTypes.SET_FEATURED_PRODUCTS:
      return {
        ...state,
        featuredProducts: action.payload
      };
      
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case actionTypes.SHOW_CART_TOAST:
      return {
        ...state,
        cartToast: action.payload
      };

    case actionTypes.HIDE_CART_TOAST:
      return {
        ...state,
        cartToast: null
      };
      
    case actionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };
      
    case actionTypes.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
      
    case actionTypes.RESET_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };
      
    case actionTypes.SET_PRESCRIPTIONS:
      return {
        ...state,
        prescriptions: action.payload
      };
      
    case actionTypes.ADD_PRESCRIPTION:
      return {
        ...state,
        prescriptions: [...state.prescriptions, action.payload]
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load cart: when user is logged in fetch from API; when guest load from localStorage
  useEffect(() => {
    const user = state.user;
    const customerId = user?.id ?? user?.customerId;

    if (customerId) {
      // Ensure customer token is in API client (e.g. after refresh) so cart requests don't 401
      if (!apiService.getToken() && typeof localStorage !== 'undefined') {
        const t = localStorage.getItem('token');
        if (t) apiService.setToken(t);
      }
      // Fetch cart, merge same medicine into one row, then clean duplicate lines on backend
      apiService.getCartByCustomer(customerId).then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const { merged, duplicateIds } = mergeCartByMedicineId(res.data);
          dispatch({ type: actionTypes.SET_CART, payload: merged });
          duplicateIds.forEach((id) => apiService.removeCartItemApi(id));
        }
      });
      return;
    }

    // Guest: load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        const validCart = Array.isArray(cart) ? cart.filter(item =>
          item && item.id && item.name &&
          !item.name.includes('Wireless Headphones') &&
          !item.name.includes('Fitness Watch') &&
          !item.name.includes('Bluetooth Speaker')
        ) : [];
        if (validCart.length > 0) {
          dispatch({ type: actionTypes.CLEAR_CART });
          validCart.forEach(item => {
            dispatch({ type: actionTypes.ADD_TO_CART, payload: { ...item, quantity: item.quantity || 1 } });
          });
        } else {
          dispatch({ type: actionTypes.CLEAR_CART });
        }
      } catch {
        dispatch({ type: actionTypes.CLEAR_CART });
      }
    } else {
      dispatch({ type: actionTypes.CLEAR_CART });
    }
  }, [state.user]);

  // Save cart to localStorage only for guests (logged-in user cart lives on backend)
  useEffect(() => {
    if (!state.user) {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    }
  }, [state.cart, state.user]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        favorites.forEach(item => {
          dispatch({ type: actionTypes.ADD_TO_FAVORITES, payload: item });
        });
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  // Restore login and token on refresh so user stays logged in and cart can be fetched
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        apiService.setToken(savedToken);
        dispatch({ type: actionTypes.SET_USER, payload: user });
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
  }, []);

  // Load prescriptions from localStorage on mount
  useEffect(() => {
    const savedPrescriptions = localStorage.getItem('prescriptions');
    if (savedPrescriptions) {
      try {
        const prescriptions = JSON.parse(savedPrescriptions);
        dispatch({ type: actionTypes.SET_PRESCRIPTIONS, payload: prescriptions });
      } catch (error) {
        console.error('Error loading prescriptions from localStorage:', error);
      }
    }
  }, []);

  // Save prescriptions to localStorage whenever prescriptions change
  useEffect(() => {
    localStorage.setItem('prescriptions', JSON.stringify(state.prescriptions));
  }, [state.prescriptions]);

  const customerId = state.user?.id ?? state.user?.customerId;

  const refreshCartFromApi = () => {
    if (!customerId) return Promise.resolve();
    return apiService.getCartByCustomer(customerId).then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const { merged, duplicateIds } = mergeCartByMedicineId(res.data);
        dispatch({ type: actionTypes.SET_CART, payload: merged });
        duplicateIds.forEach((id) => apiService.removeCartItemApi(id));
      }
    });
  };

  const addToCart = (product, quantity = 1) => {
    const itemName = product?.name || 'Item';
    const payload = { ...product, quantity };
    const addToLocalAndShowToast = () => {
      dispatch({ type: actionTypes.ADD_TO_CART, payload });
      dispatch({ type: actionTypes.SHOW_CART_TOAST, payload: { itemName, quantity } });
      setTimeout(() => dispatch({ type: actionTypes.HIDE_CART_TOAST }), 3000);
    };
    if (customerId) {
      // Customer cart: restore token from localStorage if needed (e.g. after refresh).
      if (!apiService.getToken()) {
        const savedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
        if (savedToken) apiService.setToken(savedToken);
      }
      // No token: add to local cart and show toast so user can keep shopping.
      if (!apiService.getToken()) {
        addToLocalAndShowToast();
        return Promise.resolve({ success: true });
      }
      // Call API; always update local cart and show toast so user gets feedback even if API fails.
      const medicineId = product?.id ?? product?.medicineId;
      if (!medicineId) {
        addToLocalAndShowToast();
        return Promise.resolve({ success: false, error: 'Product id missing' });
      }
      return apiService.addToCartApi(customerId, medicineId, quantity)
        .then((res) => {
          if (res.success) {
            addToLocalAndShowToast();
            refreshCartFromApi();
          } else {
            addToLocalAndShowToast();
          }
          return res;
        })
        .catch(() => {
          addToLocalAndShowToast();
          return { success: false, error: 'Could not sync to server' };
        });
    }
    addToLocalAndShowToast();
    return Promise.resolve({ success: true });
  };

  const updateCartItem = (cartItemId, quantity) => {
    if (customerId) {
      return apiService.updateCartItemApi(cartItemId, quantity).then((res) => {
        if (res.success) refreshCartFromApi();
        return res;
      });
    }
    dispatch({ type: actionTypes.UPDATE_CART_ITEM, payload: { id: cartItemId, quantity } });
    return Promise.resolve({ success: true });
  };

  const removeFromCart = (cartItemId) => {
    if (customerId) {
      return apiService.removeCartItemApi(cartItemId).then((res) => {
        if (res.success) refreshCartFromApi();
        return res;
      });
    }
    dispatch({ type: actionTypes.REMOVE_FROM_CART, payload: cartItemId });
    return Promise.resolve({ success: true });
  };

  const clearCart = () => {
    if (customerId) {
      return apiService.clearCartApi(customerId).then((res) => {
        if (res.success) dispatch({ type: actionTypes.SET_CART, payload: [] });
        return res;
      });
    }
    dispatch({ type: actionTypes.CLEAR_CART });
    return Promise.resolve({ success: true });
  };

  const value = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    refreshCartFromApi,
    addToFavorites: (product) => dispatch({ type: actionTypes.ADD_TO_FAVORITES, payload: product }),
    removeFromFavorites: (productId) => dispatch({ type: actionTypes.REMOVE_FROM_FAVORITES, payload: productId }),
    toggleFavorite: (product) => dispatch({ type: actionTypes.TOGGLE_FAVORITE, payload: product }),
    clearFavorites: () => dispatch({ type: actionTypes.CLEAR_FAVORITES }),
    isFavorite: (productId) => state.favorites.some(item => item.id === productId),
    setUser: (user) => dispatch({ type: actionTypes.SET_USER, payload: user }),
    logout: () => dispatch({ type: actionTypes.LOGOUT }),
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: actionTypes.CLEAR_ERROR }),
    setSearchQuery: (query) => dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: query }),
    setFilters: (filters) => dispatch({ type: actionTypes.SET_FILTERS, payload: filters }),
    resetFilters: () => dispatch({ type: actionTypes.RESET_FILTERS }),
    // Prescription helper functions
    addPrescription: (prescription) => dispatch({ type: actionTypes.ADD_PRESCRIPTION, payload: prescription }),
    setPrescriptions: (prescriptions) => dispatch({ type: actionTypes.SET_PRESCRIPTIONS, payload: prescriptions })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
