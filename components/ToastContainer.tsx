
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { activeToasts } = useAppContext();

  return (
    <div className="fixed top-[8.25rem] right-4 z-50 space-y-3">
      {activeToasts.map(notification => (
        <Toast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default ToastContainer;
