
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { PurchasedCall } from '../types';

const PurchasesPage: React.FC = () => {
  const { user } = useAppContext();

  if (!user) {
    return <div className="text-center py-20">Loading purchase history...</div>;
  }
  
  // Sort purchases from most recent to oldest
  const sortedPurchases = [...user.purchaseHistory].sort((a, b) => b.purchaseTime - a.purchaseTime);

  const PurchaseHistoryItem: React.FC<{ purchase: PurchasedCall }> = ({ purchase }) => {
    const { setActiveCall } = useAppContext();
    const navigate = useNavigate();
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const callDurationMs = purchase.product.duration * 60 * 1000;
    const callEndTime = purchase.purchaseTime + callDurationMs;

    let status: 'active' | 'completed';
    let timeLeftMs = 0;

    if (now < callEndTime) {
        status = 'active';
        timeLeftMs = callEndTime - now;
    } else {
        status = 'completed';
    }
    
    const handleGoToCall = () => {
        setActiveCall(purchase);
        navigate('/waiting-room');
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const renderStatus = () => {
        switch (status) {
            case 'active':
                return (
                    <div className="text-center sm:text-right space-y-2">
                        <p className="text-sm font-semibold text-brand-green">Call in Progress</p>
                        <p className="text-lg font-mono text-gray-700">{formatTime(timeLeftMs)}</p>
                        <button onClick={handleGoToCall} className="w-full sm:w-auto bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                            Rejoin Call
                        </button>
                    </div>
                );
            case 'completed':
                 return (
                    <div className="text-center sm:text-right space-y-2">
                         <p className="text-sm font-semibold text-gray-500">Call Completed</p>
                         <button className="w-full sm:w-auto bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-lg cursor-not-allowed" disabled>
                            Finished
                         </button>
                    </div>
                 );
            default:
                return null;
        }
    }
    
    const purchaseDate = new Date(purchase.purchaseTime);
    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img 
                src={purchase.model.profileImage} 
                alt={purchase.model.name}
                className="w-24 h-32 object-cover rounded-md"
            />
            <div className="flex-grow text-center sm:text-left">
                <p className="text-xl font-bold text-brand-text-dark">
                    {purchase.product.duration}-Minute Call with {purchase.model.name}
                </p>
                <p className="text-sm text-gray-500">
                    Purchased on {purchaseDate.toLocaleDateString()} at {purchaseDate.toLocaleTimeString()}
                </p>
            </div>
            <div className="w-full sm:w-auto">
                {renderStatus()}
            </div>
        </div>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-10">My Purchase History</h1>
      
      <div className="space-y-6">
        {sortedPurchases.length > 0 ? (
          sortedPurchases.map((purchase, index) => (
            <PurchaseHistoryItem key={`${purchase.purchaseTime}-${index}`} purchase={purchase} />
          ))
        ) : (
          <div className="text-center bg-white p-12 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-brand-text-dark mb-2">You Have No Past Purchases</h2>
            <p className="text-gray-600 mb-6">
              Your next memorable connection is waiting in The Gallery.
            </p>
            <Link 
                to="/catalog" 
                className="inline-block bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Explore Models
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasesPage;