import React from 'react';
import { Clock, CheckCircle, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { getStatusConfig } from '../config/prescriptionStatusConfig';
import './StatusBadge.css';

const StatusBadge = ({ status, showIcon = true, size = 'md' }) => {
  const statusConfig = getStatusConfig(status);
  
  const getIcon = () => {
    const iconProps = { size: size === 'sm' ? 16 : 20 };
    switch (statusConfig.icon) {
      case 'Clock':
        return <Clock {...iconProps} />;
      case 'CheckCircle':
        return <CheckCircle {...iconProps} />;
      case 'CreditCard':
        return <CreditCard {...iconProps} />;
      case 'ShieldCheck':
        return <ShieldCheck {...iconProps} />;
      case 'Truck':
        return <Truck {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  return (
    <span 
      className={`status-badge status-badge-${status} status-badge-${size}`}
      style={{
        '--status-color': statusConfig.color,
        '--status-bg': statusConfig.bgColor,
        '--status-border': statusConfig.borderColor
      }}
    >
      {showIcon && <span className="status-icon">{getIcon()}</span>}
      <span className="status-label">{statusConfig.label}</span>
    </span>
  );
};

export default StatusBadge;
