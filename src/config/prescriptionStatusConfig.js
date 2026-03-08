// Prescription Status Configuration
// Defines all possible prescription statuses and their UI properties

export const prescriptionStatuses = {
  pending: {
    label: 'Pending',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#FED7AA',
    icon: 'Clock',
    description: 'Awaiting review by pharmacist'
  },
  approved: {
    label: 'Approved',
    color: '#10B981',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    icon: 'CheckCircle',
    description: 'Prescription verified and approved'
  },
  paid: {
    label: 'Paid',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    icon: 'CreditCard',
    description: 'Payment completed'
  },
  verified: {
    label: 'Verified',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    icon: 'ShieldCheck',
    description: 'Prescription verified by pharmacist'
  },
  dispatched: {
    label: 'Dispatched',
    color: '#017173',
    bgColor: '#F0FDFA',
    borderColor: '#A7F3D0',
    icon: 'Truck',
    description: 'Order dispatched for delivery'
  }
};

// Status progression order
export const statusOrder = ['pending', 'approved', 'paid', 'verified', 'dispatched'];

// Get status config
export const getStatusConfig = (status) => {
  return prescriptionStatuses[status] || prescriptionStatuses.pending;
};

// Check if status is active (completed)
export const isStatusActive = (currentStatus, checkStatus) => {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const checkIndex = statusOrder.indexOf(checkStatus);
  return checkIndex <= currentIndex;
};

export default prescriptionStatuses;
