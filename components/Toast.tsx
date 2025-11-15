
import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { useAppContext } from '../hooks/useAppContext';

interface ToastProps {
  notification: Notification;
}

const Toast: React.FC<ToastProps> = ({ notification }) => {
  const { markNotificationAsRead, dismissToast } = useAppContext();
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Animate in shortly after mount
    const mountTimer = setTimeout(() => setIsMounted(true), 100);

    // Set timer to trigger exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      // After animation, dismiss from view without marking as read
      setTimeout(() => dismissToast(notification.id), 500); // Match animation duration
    }, 4000); // 4s for a slower process

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(exitTimer);
    };
  }, [notification.id, dismissToast]);

  const baseClasses = 'relative w-full max-w-sm p-4 rounded-lg shadow-lg text-white flex items-center transform transition-all duration-500 ease-in-out';
  const visibleClasses = 'opacity-100 translate-x-0';
  const hiddenClasses = 'opacity-0 translate-x-full';
  
  const typeClasses = {
    success: 'bg-brand-green',
    error: 'bg-brand-red',
    info: 'bg-brand-secondary',
  };
  
  const Icon = () => {
    switch (notification.type) {
      case 'success':
        return <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
      case 'error':
        return <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
      case 'info':
        return <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
      default:
        return null;
    }
  };

  return (
    <div className={`${baseClasses} ${typeClasses[notification.type]} ${isMounted && !isExiting ? visibleClasses : hiddenClasses}`}>
      <Icon />
      <p className="flex-1 font-medium">{notification.message}</p>
      <button 
        onClick={() => markNotificationAsRead(notification.id)}
        className="ml-4 p-1 rounded-full hover:bg-white/20"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

export default Toast;
