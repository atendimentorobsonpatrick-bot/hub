import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import InteractiveStarRating from '../components/InteractiveStarRating';

const WaitingRoom: React.FC = () => {
  const { purchasedCall, endCall, addNotification, addReview } = useAppContext();
  const navigate = useNavigate();
  const [callState, setCallState] = useState<'active' | 'finished' | null>(null);
  const [callDurationLeft, setCallDurationLeft] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Main logic for handling the call timer
  useEffect(() => {
    if (!purchasedCall) {
      navigate('/');
      return;
    }

    const callEndTime = purchasedCall.purchaseTime + purchasedCall.product.duration * 60 * 1000;
    
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(error => {
          console.error("Video autoplay failed. User interaction might be required.", error);
        });
      }
    };

    // Set initial state
    const initialTimeLeft = callEndTime - Date.now();
    if (initialTimeLeft <= 0) {
        setCallState('finished');
        setCallDurationLeft(0);
        return;
    }
    
    setCallState('active');
    setCallDurationLeft(initialTimeLeft);
    playVideo(); // Play video on entry/rejoin

    // Timer interval
    const callInterval = setInterval(() => {
        const remaining = callEndTime - Date.now();
        if (remaining <= 0) {
            clearInterval(callInterval);
            setCallState('finished');
            setCallDurationLeft(0);
        } else {
            setCallDurationLeft(remaining);
        }
    }, 1000);

    return () => clearInterval(callInterval);

  }, [purchasedCall, navigate]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSubmitFeedback = () => {
    if (!purchasedCall) return;

    if (rating === 0 && commentText.trim() === '') {
      addNotification("Please provide a rating or a comment to submit.", 'error');
      return;
    }
    
    addReview(purchasedCall.model.id, rating, commentText.trim(), purchasedCall.purchaseTime);
    
    // Clear the form
    setCommentText('');
    setRating(0);
  };

  const handleCallButtonClick = () => {
      if (callState === 'finished') {
          // If the call is over, end it for good and go home
          endCall();
          navigate('/');
      } else {
          // If the user leaves early, just navigate away, allowing them to rejoin
          navigate('/');
      }
  }

  if (!purchasedCall || callState === null) {
    return (
        <div className="container mx-auto max-w-4xl p-4 md:p-8 text-center flex flex-col items-center justify-center h-full">
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-pink mb-4"></div>
             <h2 className="text-2xl font-semibold text-brand-text-dark">
                 Connecting Your Private Call...
             </h2>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8 text-center">
      <p className="text-lg text-gray-600 mb-6">
        {callState === 'active' ? `Your private call with ${purchasedCall.model.name} is in progress.` : 'Your private call has ended.'}
      </p>
      
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 border border-gray-200">
        <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
            <video 
              ref={videoRef}
              src={purchasedCall.model.videoUrl} 
              className="w-full h-full object-cover"
              autoPlay 
              loop 
              muted 
              playsInline 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-between p-4">
                <div className="w-full flex justify-between items-start">
                    <div className="text-left">
                        {callState === 'active' && (
                            <div className="inline-flex items-center gap-2 bg-brand-red text-white font-bold text-xs py-1 px-2 rounded-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                <span>LIVE</span>
                            </div>
                        )}
                    </div>
                    {callDurationLeft !== null && (
                        <div className="bg-black/50 text-white font-mono text-sm sm:text-lg py-1 px-3 rounded-lg">
                            {formatTime(callDurationLeft)}
                        </div>
                    )}
                </div>
                
                {callState === 'finished' && (
                    <div className="text-center bg-black/60 p-4 rounded-lg backdrop-blur-sm">
                        <h3 className="text-3xl font-bold text-white">Call Ended</h3>
                    </div>
                )}
                
                <div className="w-full flex justify-end items-end">
                    <button onClick={handleCallButtonClick} className={`font-bold py-2 px-6 rounded-lg transition duration-300 ${callState === 'finished' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-brand-red hover:bg-red-700 text-white'}`}>
                        {callState === 'finished' ? 'Return to Gallery' : 'Leave Call'}
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="mt-8 p-8 bg-white rounded-lg shadow-xl border border-gray-200">
        {purchasedCall.feedbackSubmitted ? (
            <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="text-2xl font-semibold text-brand-text-dark mt-4">Thank You for Your Feedback!</h3>
                <p className="text-gray-600 mt-2">Your review is pending approval and will be public shortly.</p>
            </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
              <h3 className="text-2xl text-brand-text-dark">
                  Share Your Experience
              </h3>
              
              <InteractiveStarRating 
                  rating={rating} 
                  setRating={setRating}
              />
              
              <div className="w-full max-w-lg mx-auto">
                   <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={`How was your conversation with ${purchasedCall.model.name}? (Optional)`}
                      className="w-full p-4 bg-white border-2 border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition text-brand-text-dark placeholder-gray-500"
                      rows={4}
                      aria-label="Comment input box"
                  />
              </div>
              <div className="flex justify-center">
                   <button
                      onClick={handleSubmitFeedback}
                      disabled={rating === 0 && commentText.trim() === ''}
                      className="bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-3 px-12 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      Submit Feedback
                  </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;