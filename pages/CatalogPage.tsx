
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import ModelCard from '../components/ModelCard';
import { Model, ModelStatus } from '../types';
import ModelFilters from '../components/ModelFilters';

type Filters = {
  ageRange: string;
};

const getAverageRating = (model: Model) => {
    if (!model.reviews || model.reviews.length === 0) return 0;
    const totalRating = model.reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / model.reviews.length;
};

const CatalogPage: React.FC = () => {
  const { models, isLoadingModels } = useAppContext();
  const [filters, setFilters] = useState<Filters>({ ageRange: '' });
  const [sortBy, setSortBy] = useState('rating');
  
  const onlineModelsCount = models.filter(m => m.status === ModelStatus.Online).length;
  
  const getModelMinPrice = (model: Model) => {
    if (!model.products || model.products.length === 0) {
      return Infinity;
    }
    return Math.min(...model.products.map(p => p.price));
  };

  const getModelMaxPrice = (model: Model) => {
      if (!model.products || model.products.length === 0) {
          return -Infinity;
      }
      return Math.max(...model.products.map(p => p.price));
  };


  const filteredAndSortedModels = useMemo(() => {
    let processedModels = [...models];

    // Filtering by status (always show Online first)
    processedModels = processedModels.sort((a, b) => {
        if (a.status === ModelStatus.Online && b.status !== ModelStatus.Online) return -1;
        if (a.status !== ModelStatus.Online && b.status === ModelStatus.Online) return 1;
        return 0;
    });

    // Filtering by age
    if (filters.ageRange) {
        const [min, max] = filters.ageRange.split('-').map(Number);
        processedModels = processedModels.filter(model => model.age >= min && model.age <= max);
    }

    // Sorting
    switch (sortBy) {
        case 'rating':
            processedModels.sort((a, b) => getAverageRating(b) - getAverageRating(a));
            break;
        case 'price_asc':
            processedModels.sort((a, b) => getModelMinPrice(a) - getModelMinPrice(b));
            break;
        case 'price_desc':
            processedModels.sort((a, b) => getModelMaxPrice(b) - getModelMaxPrice(a));
            break;
        default:
            // Default sort is already handled by status
            break;
    }
    
    return processedModels;

  }, [models, filters, sortBy]);

  if (isLoadingModels) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-pink mx-auto mb-4"></div>
                <h2 className="text-2xl font-semibold text-brand-text-dark">Curating The Gallery...</h2>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-10 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg mb-8 border border-gray-200">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-text-dark tracking-tight">
          The AURA Gallery
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Discover our exclusive selection of verified models. Your next memorable conversation starts here.
        </p>
         <div className="mt-6 inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-brand-green bg-green-100">
           {onlineModelsCount > 0 ? `${onlineModelsCount} ${onlineModelsCount === 1 ? 'Model is' : 'Models are'} Currently Online` : 'No Models Are Online Right Now'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 md:self-start md:sticky md:top-24">
          <ModelFilters 
            onFilterChange={setFilters}
            onSortChange={setSortBy}
          />
        </aside>

        <main className="md:col-span-3">
            {filteredAndSortedModels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                    {filteredAndSortedModels.map(model => (
                    <ModelCard key={model.id} model={model} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-12 rounded-lg shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-semibold text-brand-text-dark mb-2">No Results Found</h2>
                    <p className="text-gray-600">
                    Try adjusting your filters to discover more models.
                    </p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;