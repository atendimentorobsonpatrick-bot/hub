
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import ModelCard from '../components/ModelCard';
import { HeartIcon } from '../components/Icons';

const FavoritesPage: React.FC = () => {
  const { user, models, isLoadingModels } = useAppContext();

  if (isLoadingModels) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-pink mx-auto mb-4"></div>
                <h2 className="text-2xl font-semibold text-brand-text-dark">Loading Favorites...</h2>
            </div>
        </div>
    );
  }
  
  const favoritedModels = user
    ? models.filter(model => user.favorites.includes(model.id))
    : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-10 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg mb-8 border border-gray-200">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-text-dark tracking-tight">
          My Favorites
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Your personal collection of favorite models. Reconnect whenever they're online.
        </p>
      </div>

      {favoritedModels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favoritedModels.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-white p-12 rounded-lg shadow-lg border border-gray-200">
          <HeartIcon filled={false} className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-brand-text-dark mb-2">Build Your Favorites List</h2>
          <p className="text-gray-600 mb-6">
            Click the heart icon on any model's profile to add them to your private collection.
          </p>
          <Link 
            to="/catalog" 
            className="inline-block bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            Explore The Gallery
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;