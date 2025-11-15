import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import InteractiveStarRating from '../components/InteractiveStarRating';
import StarRating from '../components/StarRating';
import { Review } from '../types';
import { UserIcon } from '../components/Icons';

const AdminReviewsPage: React.FC = () => {
  const { models, addAdminReview, addNotification, updateReviewStatus } = useAppContext();

  // State for the "Add New Review" form
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || '');
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [isLeadComment, setIsLeadComment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Memoize the list of pending reviews
  const pendingReviews = useMemo(() => {
    const allPending: (Review & { modelId: string; modelName: string })[] = [];
    models.forEach(model => {
        model.reviews.forEach(review => {
            if (review.status === 'pending') {
                allPending.push({ ...review, modelId: model.id, modelName: model.name });
            }
        });
    });
    return allPending.sort((a, b) => (b.id > a.id ? 1 : -1)); // Show newest first
  }, [models]);

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModelId || !username || rating === 0 || !comment) {
      addNotification('Please fill out all fields.', 'error');
      return;
    }
    setIsSubmitting(true);
    
    const modelName = models.find(m => m.id === selectedModelId)?.name || 'the selected model';
    addAdminReview(selectedModelId, username, rating, comment, isLeadComment, profilePicUrl);
    
    addNotification(`Review by ${username} added to ${modelName}!`, 'success');
    
    // Reset form fields, but keep the model selected for efficiency
    setUsername('');
    setRating(0);
    setComment('');
    setProfilePicUrl('');
    setIsLeadComment(false);
    
    setIsSubmitting(false);
  };
  
  React.useEffect(() => {
      if (!selectedModelId && models.length > 0) {
          setSelectedModelId(models[0].id);
      }
  }, [models, selectedModelId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      addNotification('Image size should be less than 2MB.', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      addNotification('Please select a valid image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8 space-y-12">
        <h1 className="text-3xl font-bold text-center mb-0 text-brand-text-dark">
          Review Management
        </h1>
      {/* Pending Reviews Section */}
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-semibold">Pending Approval ({pendingReviews.length})</h2>
            <p className="text-gray-500 text-sm">Approve or reject new reviews submitted by users.</p>
        </div>
        <div className="space-y-6 max-h-96 overflow-y-auto pr-4 -mr-4">
            {pendingReviews.length > 0 ? (
                pendingReviews.map(review => (
                    <div key={review.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-start gap-4">
                            {review.profilePic ? (
                                <img src={review.profilePic} alt={review.username} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold flex-shrink-0">
                                    {review.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-grow">
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                   <div>
                                     <p className="font-semibold">{review.username} on <span className="font-bold text-brand-pink">{review.modelName}</span></p>
                                     <StarRating rating={review.rating} />
                                   </div>
                                   <div className="flex items-center gap-3 flex-shrink-0">
                                        <button onClick={() => updateReviewStatus(review.modelId, review.id, 'approved')} className="bg-brand-green hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">
                                            Approve
                                        </button>
                                        <button onClick={() => updateReviewStatus(review.modelId, review.id, 'rejected')} className="bg-brand-red hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">
                                            Reject
                                        </button>
                                   </div>
                                </div>
                                <p className="mt-2 text-gray-700 italic">"{review.comment}"</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-6">There are no pending reviews to moderate.</p>
            )}
        </div>
      </div>
      
      {/* Add New Review Section */}
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-2 text-brand-text-dark">
          Add a Review
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Manually add pre-approved reviews to a model's profile.
        </p>

        <form onSubmit={handleSingleSubmit} className="space-y-6">
          <div>
            <label htmlFor="model-select" className="block text-sm font-medium text-gray-700">
              Select Model
            </label>
            <select
              id="model-select"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="mt-1 block w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink"
            >
              <option value="" disabled>-- Choose a model --</option>
              {models.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., John D."
              className="mt-1 block w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink"
              required
            />
          </div>
          
           <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture (Optional)
              </label>
              <div className="mt-1 flex items-center gap-4">
                {profilePicUrl ? (
                  <img src={profilePicUrl} alt="Profile preview" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    id="profile-pic-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="profile-pic-upload"
                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink"
                  >
                    Upload Image
                  </label>
                  {profilePicUrl && (
                    <button
                      type="button"
                      onClick={() => setProfilePicUrl('')}
                      className="text-sm text-red-600 hover:underline text-left"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

          <div className="flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <InteractiveStarRating rating={rating} setRating={setRating} />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write the review here..."
              className="mt-1 block w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-brand-pink focus:border-brand-pink"
              required
            />
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="isLeadComment"
                type="checkbox"
                checked={isLeadComment}
                onChange={(e) => setIsLeadComment(e.target.checked)}
                className="focus:ring-brand-pink h-4 w-4 text-brand-pink border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isLeadComment" className="font-medium text-gray-700">
                Hide this comment (Lead Comment)
              </label>
              <p className="text-gray-500">If checked, this comment will not be visible to the public.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Add Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminReviewsPage;