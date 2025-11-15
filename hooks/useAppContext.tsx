import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Model, CartItem, PurchasedCall, ModelStatus, User, VerificationDetails, Notification, NotificationType, Review } from '../types';
import { getModels } from '../services/geminiService';
import { BACKEND_URL } from '../config';

export interface CustomerDetails {
    name: string;
    email: string;
}

export interface CardDetails {
    number: string;
    holderName: string;
    expMonth: string;
    expYear: string;
    cvv: string;
}

type SocialLoginUser = Omit<User, 'verificationStatus' | 'purchaseHistory' | 'verificationDetails' | 'favorites' | 'notifications'>;

interface AppContextType {
  models: Model[];
  isLoadingModels: boolean;
  cart: CartItem | null;
  purchasedCall: PurchasedCall | null;
  user: User | null;
  isLoginModalOpen: boolean;
  notifications: Notification[];
  activeToasts: Notification[];
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  processPayment: (customer: CustomerDetails, card: CardDetails) => Promise<void>;
  endCall: () => void;
  register: (user: SocialLoginUser) => void;
  socialLogin: (user: SocialLoginUser) => void;
  login: (credentials: {email: string}) => boolean;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  submitVerification: (details: VerificationDetails) => void;
  updateUserProfilePic: (newPicUrl: string) => void;
  updateUserProfile: (details: { name: string; bio: string }) => void;
  setActiveCall: (call: PurchasedCall) => void;
  addNotification: (message: string, type?: NotificationType) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissToast: (id: string) => void;
  toggleFavorite: (modelId: string) => void;
  isFavorite: (modelId: string) => boolean;
  addReview: (modelId: string, rating: number, comment: string, purchaseTime: number) => void;
  addAdminReview: (modelId: string, username: string, rating: number, comment: string, isLeadComment: boolean, profilePicUrl: string) => void;
  updateReviewStatus: (modelId: string, reviewId: string, status: 'approved' | 'rejected') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem | null>(null);
  const [purchasedCall, setPurchasedCall] = useState<PurchasedCall | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [dismissedToastIds, setDismissedToastIds] = useState<Set<string>>(new Set());
  
  // This check determines if the app is configured to talk to the backend.
  const isConfigured = !BACKEND_URL.includes('YOUR_BACKEND_URL');

  // Load user and active call from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('auraUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedCall = localStorage.getItem('auraPurchasedCall');
    if (storedCall) {
        setPurchasedCall(JSON.parse(storedCall));
    }
  }, []);

  const addNotification = useCallback((message: string, type: NotificationType = 'info') => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const id = `${Date.now()}-${Math.random()}`;
        const newNotification: Notification = { id, message, type, read: false };
        const updatedUser = {
            ...prevUser,
            notifications: [...(prevUser.notifications || []), newNotification],
        };
        localStorage.setItem('auraUser', JSON.stringify(updatedUser));
        return updatedUser;
    });
  }, []);


  const markNotificationAsRead = useCallback((id: string) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedNotifications = (prevUser.notifications || []).map(n => 
            n.id === id ? { ...n, read: true } : n
        );
        const updatedUser = { ...prevUser, notifications: updatedNotifications };
        localStorage.setItem('auraUser', JSON.stringify(updatedUser));
        return updatedUser;
    });
  }, []);
  
  const markAllNotificationsAsRead = useCallback(() => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedNotifications = (prevUser.notifications || []).map(n => ({ ...n, read: true }));
        const updatedUser = { ...prevUser, notifications: updatedNotifications };
        localStorage.setItem('auraUser', JSON.stringify(updatedUser));
        return updatedUser;
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setDismissedToastIds(prev => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
    });
  }, []);

  const activeToasts = useMemo(() => 
    (user?.notifications || []).filter(n => !n.read && !dismissedToastIds.has(n.id)),
    [user?.notifications, dismissedToastIds]);

  // Load models from the "backend"
  useEffect(() => {
    // PRE-FETCH CHECK: Only attempt to load models if the backend URL is configured.
    // This prevents the "DEVELOPER ERROR" from appearing in the console when the
    // configuration screen is active.
    if (!isConfigured) {
        setIsLoadingModels(false); // Ensure loading spinners stop.
        return;
    }

    const fetchModels = async () => {
        setIsLoadingModels(true);
        try {
            const data = await getModels();
            setModels(data);
        } catch (error) {
            console.error("Failed to fetch models:", error);
            addNotification('Could not load model data. Please try again later.', 'error');
        } finally {
            setIsLoadingModels(false);
        }
    };
    fetchModels();
  }, [isConfigured, addNotification]);
  
  // Simulate real-time status changes for models
  useEffect(() => {
    if (isLoadingModels || !isConfigured) return; // Don't run if models aren't loaded yet

    const interval = setInterval(() => {
      setModels(prevModels =>
        prevModels.map(model => {
          if (Math.random() < 0.1) { // 10% chance to change status
            // Only toggle between Online and Offline.
            const newStatus = model.status === ModelStatus.Online ? ModelStatus.Offline : ModelStatus.Online;
            return { ...model, status: newStatus };
          }
          return model;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLoadingModels, isConfigured]);
  
  const endCall = useCallback(() => {
      setPurchasedCall(null);
      localStorage.removeItem('auraPurchasedCall');
  }, []);

  const register = (userData: SocialLoginUser) => {
    const newUser: User = { 
        ...userData, 
        verificationStatus: 'unverified',
        purchaseHistory: [],
        favorites: [],
        notifications: [],
    };
    localStorage.setItem('auraUser', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoginModalOpen(false); // Close modal on success
    addNotification(`Welcome, ${newUser.name}!`, 'success');
  };

  const socialLogin = (userData: SocialLoginUser) => {
    // This is a simplified social login. A real app would check if the user exists
    // in a database. Here, we just create a new user profile in local storage.
    const newUser: User = { 
        ...userData, 
        verificationStatus: 'unverified',
        purchaseHistory: [],
        favorites: [],
        notifications: [],
    };
    localStorage.setItem('auraUser', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoginModalOpen(false); // Ensure modal is closed
  };

  const login = (credentials: {email: string}): boolean => {
    const storedUserStr = localStorage.getItem('auraUser');
    if (storedUserStr) {
        const storedUser: User = JSON.parse(storedUserStr);
        // Mock authentication: check email, ignore password as we don't store it
        if (storedUser.email === credentials.email) {
            setUser(storedUser); // Set the user state with the stored user
            setIsLoginModalOpen(false);
            addNotification(`Welcome back, ${storedUser.name}!`, 'success');
            return true;
        }
    }
    return false; // User not found or email doesn't match
  };

  const logout = () => {
    localStorage.removeItem('auraUser');
    setUser(null);
    setCart(null); // Also clear cart on logout
    endCall(); // Use endCall to clear call state and storage
  };

  const submitVerification = (details: VerificationDetails) => {
    if (!user) return;
    console.log(`Simulating verification for details:`, details);
    
    // Set status to pending and add details
    const pendingUser: User = { 
        ...user, 
        verificationStatus: 'pending' as const,
        verificationDetails: details 
    };
    setUser(pendingUser);
    localStorage.setItem('auraUser', JSON.stringify(pendingUser));
    addNotification('Verification submitted. We will review it shortly.', 'info');

    // Simulate a delay for the verification process
    setTimeout(() => {
      // Important: read the latest user state from local storage in case it changed
      const latestUserStr = localStorage.getItem('auraUser');
      if (latestUserStr) {
          const latestUser: User = JSON.parse(latestUserStr);
          // Only update if the user is the same and status is still pending
          if(latestUser.email === user.email && latestUser.verificationStatus === 'pending') {
            const verifiedUser: User = { ...latestUser, verificationStatus: 'verified' as const };
            setUser(verifiedUser);
            localStorage.setItem('auraUser', JSON.stringify(verifiedUser));
            addNotification('Your account has been successfully verified!', 'success');
          }
      }
    }, 5000); // 5-second delay
  };

  const updateUserProfilePic = (newPicUrl: string) => {
    if (!user) return;
    const updatedUser = { ...user, profilePic: newPicUrl };
    setUser(updatedUser);
    localStorage.setItem('auraUser', JSON.stringify(updatedUser));
    addNotification('Profile picture updated!', 'success');
  };
  
  const updateUserProfile = (details: { name: string; bio: string }) => {
    if (!user) return;
    const updatedUser = { ...user, name: details.name, bio: details.bio };
    setUser(updatedUser);
    localStorage.setItem('auraUser', JSON.stringify(updatedUser));
    addNotification('Profile details saved!', 'success');
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const addToCart = (item: CartItem) => {
    setCart(item);
    addNotification(`${item.model.name} has been added to your bag.`, 'info');
  };

  const clearCart = () => {
    setCart(null);
  };

  const processPayment = async (customer: CustomerDetails, card: CardDetails) => {
    if (!cart || !user) {
        throw new Error("Cannot process payment without a cart item and user.");
    }
    
    // IMPORTANT: In a real application, the API_TOKEN should be kept on a secure backend server.
    // Exposing it on the frontend is a security risk.
    const API_TOKEN = "yUh30b6Bupd9XCJ22MnDSvHPGPy3by3cA7K5atRdIJrebvR7ez2Qn7DSujgP";
    const API_ENDPOINT = 'https://api.frendz.com.br/api/public/v1/transactions';

    const payload = {
        amount: Math.round(cart.product.price * 100), // Price in cents
        offer_hash: cart.product.offerHash,
        payment_method: "credit_card",
        card: {
            number: card.number.replace(/\s/g, ''),
            holder_name: card.holderName,
            exp_month: parseInt(card.expMonth),
            exp_year: parseInt(card.expYear),
            cvv: card.cvv,
        },
        customer: {
            name: customer.name,
            email: customer.email,
            // TODO: These are mandatory fields according to the Frendz API.
            // You need to collect this information from the user, for example,
            // in the user profile or during checkout, and pass it here.
            phone_number: "11999999999", // Placeholder
            document: "00000000000",     // Placeholder (e.g., CPF for Brazil)
        },
        cart: [
            {
                product_hash: cart.product.productHash,
                title: `${cart.product.duration}-Minute Call with ${cart.model.name}`,
                price: Math.round(cart.product.price * 100),
                quantity: 1,
                operation_type: 1, // 1- venda principal
            }
        ],
        installments: 1,
        transaction_origin: "api",
    };

    console.log("Sending to Frendz API:", JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${API_ENDPOINT}?api_token=${API_TOKEN}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        let errorMessage = 'Payment failed. Please check your details and try again.';
        try {
            const errorData = await response.json();
            console.error("Frendz API Error Response:", errorData);

            let apiMessage = '';
            // The Frendz API might return errors in an 'errors' array or a 'message' property
            if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                 apiMessage = errorData.errors.map((err: any) => err.message || 'Unknown API error').join(', ');
            } else if (errorData?.message) {
                 apiMessage = errorData.message;
            }

            // Check for the specific known configuration error from Frendz API
            if (apiMessage.includes("adquirente não está disponivel para api")) {
                // This is a specific, known configuration error on the merchant's account.
                // We provide a more helpful message that directs the site owner on how to fix it.
                throw new Error("Payment Gateway Error: Your merchant account is not configured for API transactions. Please contact Frendz.com.br support to enable API payments for your acquirer.");
            }
            
            if (apiMessage) {
                errorMessage = apiMessage;
            }

        } catch (e: any) {
            // This catch block handles two cases:
            // 1. The custom error we threw above.
            // 2. An error from `response.json()` if the body is not valid JSON.
            if (e.message.startsWith("Payment Gateway Error:")) {
                throw e; // Re-throw our specific, helpful error.
            }
            // If JSON parsing failed, we fall back to the generic message.
            console.error("Could not parse error response from API as JSON:", e);
        }
        throw new Error(errorMessage);
    }
    
    // If API call is successful, update app state
    const newPurchase: PurchasedCall = { ...cart, purchaseTime: Date.now(), feedbackSubmitted: false };
    const updatedUser: User = {
        ...user,
        purchaseHistory: [...user.purchaseHistory, newPurchase],
    };

    setUser(updatedUser);
    localStorage.setItem('auraUser', JSON.stringify(updatedUser));
    setPurchasedCall(newPurchase);
    localStorage.setItem('auraPurchasedCall', JSON.stringify(newPurchase));
    setCart(null);
  };
  
  const setActiveCall = (call: PurchasedCall) => {
    setPurchasedCall(call);
    localStorage.setItem('auraPurchasedCall', JSON.stringify(call));
  };
  
  const isFavorite = (modelId: string): boolean => {
    return user?.favorites?.includes(modelId) ?? false;
  };

  const toggleFavorite = (modelId: string) => {
      if (!user) {
          openLoginModal();
          return;
      }
      
      const currentFavorites = user.favorites || [];
      const isCurrentlyFavorite = currentFavorites.includes(modelId);
      let updatedFavorites: string[];

      if (isCurrentlyFavorite) {
          updatedFavorites = currentFavorites.filter(id => id !== modelId);
          addNotification('Removed from favorites.', 'info');
      } else {
          updatedFavorites = [...currentFavorites, modelId];
          addNotification('Added to favorites!', 'success');
      }

      const updatedUser: User = { ...user, favorites: updatedFavorites };
      setUser(updatedUser);
      localStorage.setItem('auraUser', JSON.stringify(updatedUser));
  };

  const addReview = (modelId: string, rating: number, comment: string, purchaseTime: number) => {
    if (!user) {
        addNotification('You must be logged in to leave a review.', 'error');
        openLoginModal();
        return;
    }
    setModels(prevModels =>
        prevModels.map(model => {
            if (model.id === modelId) {
                const newReview: Review = {
                    id: `review-${Date.now()}-${Math.random()}`,
                    username: user.name,
                    rating,
                    comment,
                    status: 'pending',
                    profilePic: user.profilePic,
                };
                // In a real app, this would be an API call
                const updatedReviews = [...model.reviews, newReview];
                return { ...model, reviews: updatedReviews };
            }
            return model;
        })
    );
     // Update user's purchase history to mark feedback as submitted
    const updatedPurchaseHistory = user.purchaseHistory.map(p => {
        if (p.purchaseTime === purchaseTime) {
            return { ...p, feedbackSubmitted: true };
        }
        return p;
    });

    const updatedUser = { ...user, purchaseHistory: updatedPurchaseHistory };
    setUser(updatedUser);
    localStorage.setItem('auraUser', JSON.stringify(updatedUser));

    // Also update the active purchasedCall state if it matches
    if (purchasedCall && purchasedCall.purchaseTime === purchaseTime) {
        const updatedCall = { ...purchasedCall, feedbackSubmitted: true };
        setPurchasedCall(updatedCall);
        localStorage.setItem('auraPurchasedCall', JSON.stringify(updatedCall));
    }
  };

  const addAdminReview = (modelId: string, username: string, rating: number, comment: string, isLeadComment: boolean, profilePicUrl: string) => {
    setModels(prevModels =>
        prevModels.map(model => {
            if (model.id === modelId) {
                const newReview: Review = {
                    id: `review-${Date.now()}-${Math.random()}`,
                    username,
                    rating,
                    comment,
                    isLeadComment,
                    status: 'approved',
                    profilePic: profilePicUrl || null,
                };
                // In a real app, this would be an API call
                const updatedReviews = [...model.reviews, newReview];
                return { ...model, reviews: updatedReviews };
            }
            return model;
        })
    );
  };
  
  const updateReviewStatus = (modelId: string, reviewId: string, status: 'approved' | 'rejected') => {
    setModels(prevModels =>
        prevModels.map(model => {
            if (model.id === modelId) {
                const updatedReviews = model.reviews.map(review => {
                    if (review.id === reviewId) {
                        return { ...review, status };
                    }
                    return review;
                });
                return { ...model, reviews: updatedReviews };
            }
            return model;
        })
    );
    addNotification(`Review has been ${status}.`, 'success');
  };

  const value = { 
    models, 
    isLoadingModels,
    cart, 
    purchasedCall, 
    user, 
    isLoginModalOpen,
    notifications: user?.notifications || [],
    activeToasts,
    addToCart, 
    clearCart, 
    processPayment, 
    endCall,
    register,
    socialLogin,
    login,
    logout,
    openLoginModal,
    closeLoginModal,
    submitVerification,
    updateUserProfilePic,
    updateUserProfile,
    setActiveCall,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissToast,
    isFavorite,
    toggleFavorite,
    addReview,
    addAdminReview,
    updateReviewStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};