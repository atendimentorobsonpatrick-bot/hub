import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { LockClosedIcon } from '../components/Icons';

const Checkout: React.FC = () => {
  const { cart, user, clearCart, processPayment, addNotification } = useAppContext();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed18, setIsConfirmed18] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const [customerDetails, setCustomerDetails] = useState({
      name: user?.name || '',
      email: user?.email || '',
  });
  
  const [cardDetails, setCardDetails] = useState({
      number: '',
      expiry: '',
      cvv: '',
  });

  if (!cart) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Your Bag is Empty</h1>
        <button onClick={() => navigate('/catalog')} className="bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-3 px-6 rounded-lg transition duration-300">
          Explore The Gallery
        </button>
      </div>
    );
  }

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };
  
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
        const digitsOnly = value.replace(/\D/g, '');
        const truncated = digitsOnly.substring(0, 16);
        formattedValue = truncated.match(/.{1,4}/g)?.join(' ') || '';
    } else if (name === 'expiry') {
        const digitsOnly = value.replace(/\D/g, '');
        const truncated = digitsOnly.substring(0, 6); // MMYYYY
        if (truncated.length > 2) {
            formattedValue = `${truncated.substring(0, 2)} / ${truncated.substring(2, 6)}`;
        } else {
            formattedValue = truncated;
        }
    } else if (name === 'cvv') {
        formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardDetails({ ...cardDetails, [name]: formattedValue });
  };


  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        addNotification('You must be logged in to make a purchase.', 'error');
        return;
    }
    
    setPaymentError(null); // Reset error on new attempt
    setIsProcessing(true);

    const [expMonth, expYear] = cardDetails.expiry.split(' / ');
    if (!expMonth || !expYear || expYear.length !== 4) {
        addNotification('Please enter a valid expiration date (MM / YYYY).', 'error');
        setIsProcessing(false);
        return;
    }

    try {
        await processPayment(customerDetails, { 
            number: cardDetails.number, 
            holderName: customerDetails.name,
            expMonth,
            expYear,
            cvv: cardDetails.cvv,
        });
        addNotification('Payment successful! Your call is starting.', 'success');
        navigate('/waiting-room');
    } catch (error: any) {
        console.error("Payment failed:", error);
        const errorMessage = error.message || 'An unexpected error occurred.';
        setPaymentError(errorMessage);
        addNotification(errorMessage, 'error');
    } finally {
        setIsProcessing(false);
    }
  };

  const { model, product } = cart;
  
  const isFormComplete = 
    customerDetails.name &&
    customerDetails.email &&
    cardDetails.number.length > 18 &&
    cardDetails.expiry.length > 6 &&
    cardDetails.cvv.length >= 3;

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Secure Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 lg:sticky lg:top-28">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-2">Your Order</h2>
          <div className="flex items-center space-x-4">
            <img src={model.profileImage} alt={model.name} className="w-24 h-32 object-cover rounded-lg"/>
            <div>
              <p className="text-lg font-bold">{product.duration}-Minute Private Call with {model.name}</p>
              <p className="text-2xl font-bold text-brand-pink mt-2">${product.price.toFixed(2)}</p>
            </div>
          </div>
           <button onClick={clearCart} className="text-sm text-gray-500 hover:text-brand-pink mt-4">Remove</button>
        </div>

        {/* Payment Form */}
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
          <form onSubmit={handlePurchase} className="space-y-4">
            {/* Customer Details */}
            <fieldset>
                <legend className="text-xl font-semibold mb-2">Your Details</legend>
                <div className="space-y-4">
                    <input type="text" name="name" value={customerDetails.name} onChange={handleCustomerChange} placeholder="Full Name" className="w-full p-3 bg-gray-50 rounded border border-gray-300 focus:ring-brand-pink focus:border-brand-pink" required />
                    <input type="email" name="email" value={customerDetails.email} onChange={handleCustomerChange} placeholder="Email" className="w-full p-3 bg-gray-50 rounded border border-gray-300 focus:ring-brand-pink focus:border-brand-pink" required />
                </div>
            </fieldset>
            
            {/* Payment Details */}
            <fieldset className="pt-4">
                <legend className="text-xl font-semibold mb-2">Payment Information</legend>
                <div className="space-y-4">
                    <input type="text" inputMode="numeric" name="number" value={cardDetails.number} onChange={handleCardChange} placeholder="Card Number" className="w-full p-3 bg-gray-50 rounded border border-gray-300 focus:ring-brand-pink focus:border-brand-pink" required />
                    <div className="flex gap-4">
                        <input type="text" inputMode="numeric" name="expiry" value={cardDetails.expiry} onChange={handleCardChange} placeholder="MM / YYYY" className="w-full p-3 bg-gray-50 rounded border border-gray-300 focus:ring-brand-pink focus:border-brand-pink" required />
                        <input type="text" inputMode="numeric" name="cvv" value={cardDetails.cvv} onChange={handleCardChange} placeholder="CVV" className="w-full p-3 bg-gray-50 rounded border border-gray-300 focus:ring-brand-pink focus:border-brand-pink" required />
                    </div>
                </div>
            </fieldset>
            
            <div className="pt-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isConfirmed18}
                  onChange={() => setIsConfirmed18(!isConfirmed18)}
                  className="mt-1 h-5 w-5 rounded bg-gray-50 border-gray-300 text-brand-pink focus:ring-brand-pink"
                />
                <span className="text-sm text-gray-700">
                  I confirm I am 18+ and agree to the <a href="#" className="underline hover:text-brand-pink">Terms of Service</a> and <a href="#" className="underline hover:text-brand-pink">Cancellation Policy</a>.
                </span>
              </label>
            </div>

            {paymentError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md my-4" role="alert">
                  <p className="font-bold">Action Required</p>
                  <p className="text-sm">{paymentError}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={!isConfirmed18 || isProcessing || !isFormComplete}
              className="w-full mt-4 bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
              ) : (
                'Complete Purchase & Start Call'
              )}
            </button>
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2 pt-2">
                <LockClosedIcon className="w-4 h-4" /> Secure payment via Frendz.com.br
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;