
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ModelProfile from './pages/ModelProfile';
import Checkout from './pages/Checkout';
import WaitingRoom from './pages/WaitingRoom';
import { useAppContext } from './hooks/useAppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import UserProfile from './pages/UserProfile';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
import PurchasesPage from './pages/PurchasesPage';
import ToastContainer from './components/ToastContainer';
import FavoritesPage from './pages/FavoritesPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import NotificationsPage from './pages/NotificationsPage';

// Component to handle the auth callback logic
const AuthCallbackHandler: React.FC = () => {
    const { socialLogin, addNotification } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#auth_success')) {
            const params = new URLSearchParams(hash.substring(hash.indexOf('?')));
            const name = params.get('name');
            const email = params.get('email');
            const pic = params.get('pic');

            if (name && email) {
                socialLogin({ name, email, profilePic: pic || null });
                addNotification(`Welcome, ${name}! You are now logged in.`, 'success');
            } else {
                addNotification('Social login failed. Please try again.', 'error');
            }
            // Clean the URL
            navigate('/', { replace: true });

        } else if (hash.startsWith('#auth_failure')) {
            const params = new URLSearchParams(hash.substring(hash.indexOf('?')));
            const error = params.get('error');

            if (error === 'server_misconfigured') {
                addNotification('Login failed due to a server configuration issue. Please ensure the backend is set up correctly.', 'error');
            } else {
                addNotification('Authentication failed. Please try again.', 'error');
            }
             // Clean the URL
            navigate('/', { replace: true });
        }
    }, [socialLogin, addNotification, navigate]);

    return null; // This component doesn't render anything
}


function App() {
  const { purchasedCall, isLoginModalOpen, user, endCall, addNotification } = useAppContext();

  // Effect to clean up expired calls from state
  useEffect(() => {
    if (purchasedCall) {
        const callEndTime = purchasedCall.purchaseTime + purchasedCall.product.duration * 60 * 1000;
        if (Date.now() > callEndTime) {
            endCall();
            addNotification('Your previous call session has ended.', 'info');
        }
    }
  }, [purchasedCall, endCall, addNotification]);

  return (
    <HashRouter>
      <AuthCallbackHandler />
      <div className="flex min-h-screen flex-col bg-white text-brand-text-dark">
        <div className="fixed top-0 left-0 right-0 z-50 bg-brand-pink text-white text-center py-2 font-bold uppercase text-sm tracking-wider">
          VIDEO CHAMADA AO VIVO
        </div>
        <Header />
        <ToastContainer />
        {isLoginModalOpen && <LoginModal />}
        <main className="flex-grow pt-[7.25rem]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/model/:id" element={<ProtectedRoute><ModelProfile /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/purchases" element={<ProtectedRoute><PurchasesPage /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviewsPage /></ProtectedRoute>} />
            <Route 
              path="/waiting-room" 
              element={purchasedCall && user ? <WaitingRoom /> : <Navigate to="/" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;