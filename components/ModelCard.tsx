import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Model, ModelStatus } from '../types';
import StatusIndicator from './StatusIndicator';
import { useAppContext } from '../hooks/useAppContext';
import StarRating from './StarRating';
import { HeartIcon } from './Icons';

interface ModelCardProps {
  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const navigate = useNavigate();
  const { user, openLoginModal, toggleFavorite, isFavorite } = useAppContext();

  const navigateToProfile = () => {
    if (user) {
      navigate(`/model/${model.id}`);
    } else {
      openLoginModal();
    }
  };
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateToProfile();
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if(user) {
        toggleFavorite(model.id);
      } else {
        openLoginModal();
      }
  }

  const averageRating = model.reviews.length > 0 
    ? model.reviews.reduce((sum, review) => sum + review.rating, 0) / model.reviews.length
    : 0;
  const reviewCount = model.reviews.length;

  return (
    <div 
      onClick={navigateToProfile} 
      className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer border border-gray-200 transform transition duration-300 hover:shadow-2xl hover:shadow-brand-pink/20 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative">
        <img
          src={model.profileImage}
          alt={model.name}
          className="w-full h-96 object-cover"
        />
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-black/30 p-2 rounded-full text-white hover:bg-brand-pink hover:text-white transition duration-200"
          aria-label="Add to favorites"
        >
          <HeartIcon filled={isFavorite(model.id)} className="w-6 h-6" />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-brand-text-dark">{model.name}, {model.age}</h3>
            <StatusIndicator status={model.status} />
        </div>
        <div className="flex items-center space-x-2 mb-4">
            <StarRating rating={averageRating} />
            <span className="text-xs text-gray-500 font-medium">({reviewCount} reviews)</span>
        </div>
        <div className="mt-auto pt-2">
            <button
                onClick={handleButtonClick}
                disabled={model.status === ModelStatus.Offline}
                className="w-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {model.status === ModelStatus.Offline ? 'Currently Offline' : 'View Profile & Book'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;