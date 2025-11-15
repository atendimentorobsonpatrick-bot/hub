import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Notification, NotificationType } from '../types';

const NotificationsPage: React.FC = () => {
  const { user, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();

  const notifications = user?.notifications || [];

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          iconBg: 'bg-green-100',
          iconText: 'text-green-600',
          icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        };
      case 'error':
        return {
          iconBg: 'bg-red-100',
          iconText: 'text-red-600',
          icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-600',
          icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        };
    }
  };

  const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const iconStyles = getNotificationIcon(notification.type);
    const isUnread = !notification.read;

    return (
      <div
        onClick={() => isUnread && markNotificationAsRead(notification.id)}
        className={`p-4 rounded-lg shadow-md flex items-start gap-4 border-l-4 transition-colors duration-300 ${isUnread ? 'bg-pink-50 border-brand-pink cursor-pointer hover:bg-pink-100' : 'bg-white border-gray-200'}`}
        role={isUnread ? "button" : "listitem"}
        tabIndex={isUnread ? 0 : -1}
        aria-label={`Notification: ${notification.message}. ${isUnread ? 'Click to mark as read.' : 'This notification has been read.'}`}
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconStyles.iconBg} ${iconStyles.iconText}`}>
          {iconStyles.icon}
        </div>
        <div className="flex-grow">
          <p className="text-gray-700">{notification.message}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-brand-text-dark">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-sm font-medium text-brand-pink hover:underline"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.slice().reverse().map(notification => ( // Show newest first
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <div className="text-center bg-white p-12 rounded-lg shadow-lg border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="text-2xl font-semibold text-brand-text-dark mb-2">All Caught Up!</h2>
            <p className="text-gray-600">You have no new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;