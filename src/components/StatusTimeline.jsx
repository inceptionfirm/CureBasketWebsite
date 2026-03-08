import React from 'react';
import { Clock, CheckCircle, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { statusOrder, getStatusConfig, isStatusActive } from '../config/prescriptionStatusConfig';
import './StatusTimeline.css';

const StatusTimeline = ({ currentStatus }) => {
  const getIcon = (status) => {
    const config = getStatusConfig(status);
    const isActive = isStatusActive(currentStatus, status);
    const iconProps = { size: 20 };
    
    switch (config.icon) {
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
    <div className="status-timeline">
      {statusOrder.map((status, index) => {
        const config = getStatusConfig(status);
        const isActive = isStatusActive(currentStatus, status);
        const isCurrent = currentStatus === status;
        const isLast = index === statusOrder.length - 1;

        return (
          <div key={status} className="timeline-item">
            <div className="timeline-content">
              <div
                className={`timeline-icon ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                style={{
                  '--status-color': config.color,
                  '--status-bg': config.bgColor,
                  '--status-border': config.borderColor
                }}
              >
                {getIcon(status)}
              </div>
              <div className="timeline-info">
                <h4 className={`timeline-title ${isActive ? 'active' : ''}`}>
                  {config.label}
                </h4>
                <p className="timeline-description">{config.description}</p>
              </div>
            </div>
            {!isLast && (
              <div className={`timeline-line ${isActive ? 'active' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
