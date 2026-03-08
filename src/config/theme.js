// Pharmaceutical E-commerce Theme Configuration
export const theme = {
  colors: {
    // Primary colors - Teal theme
    primary: '#017173', // Teal
    secondary: '#FDE047', // Yellow
    accent: '#015A5C', // Darker teal
    
    // Text colors
    text: {
      primary: '#1A1A1A', // Black from "Basket"
      secondary: '#4A4A4A',
      light: '#6B7280',
      white: '#FFFFFF'
    },
    
    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
      dark: '#1A1A1A'
    },
    
    // Status colors
    success: '#017173', // Teal
    warning: '#FDE047', // Yellow
    error: '#EF4444',
    info: '#3B82F6',
    
    // Pharmaceutical specific colors
    medicine: {
      prescription: '#DC2626', // Red for prescription required
      otc: '#017173', // Teal for over-the-counter
      supplement: '#FDE047', // Yellow for supplements
      equipment: '#015A5C', // Dark teal for medical equipment
      generic: '#FDE047', // Yellow for generic medicines
      brand: '#017173' // Teal for brand medicines
    },
    
    // Healthcare specific colors
    healthcare: {
      doctor: '#017173', // Teal for doctor consultation
      pharmacy: '#FDE047', // Yellow for pharmacy services
      emergency: '#EF4444', // Red for emergency services
      insurance: '#015A5C', // Dark teal for insurance
      delivery: '#FDE047' // Yellow for delivery services
    },
    
    // Border and shadow
    border: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    pharmaceutical: '"Roboto", "Helvetica Neue", Arial, sans-serif'
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Pharmaceutical specific design tokens
  pharmaceutical: {
    // Medicine categories
    categories: {
      prescription: {
        color: '#DC2626',
        bgColor: '#FEF2F2',
        borderColor: '#FECACA'
      },
      otc: {
        color: '#059669',
        bgColor: '#F0FDF4',
        borderColor: '#BBF7D0'
      },
      supplement: {
        color: '#7C3AED',
        bgColor: '#FAF5FF',
        borderColor: '#DDD6FE'
      },
      equipment: {
        color: '#0891B2',
        bgColor: '#F0F9FF',
        borderColor: '#BAE6FD'
      }
    },
    
    // Prescription status
    prescriptionStatus: {
      pending: {
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        borderColor: '#FED7AA'
      },
      approved: {
        color: '#10B981',
        bgColor: '#F0FDF4',
        borderColor: '#BBF7D0'
      },
      rejected: {
        color: '#EF4444',
        bgColor: '#FEF2F2',
        borderColor: '#FECACA'
      }
    },
    
    // Healthcare services
    services: {
      consultation: {
        color: '#10B981',
        icon: '👨‍⚕️'
      },
      delivery: {
        color: '#F97316',
        icon: '🚚'
      },
      emergency: {
        color: '#EF4444',
        icon: '🚨'
      },
      insurance: {
        color: '#06B6D4',
        icon: '🛡️'
      }
    }
  }
};

export default theme;
