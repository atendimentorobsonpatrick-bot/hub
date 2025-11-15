import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import StatusIndicator from '../components/StatusIndicator';
import { ModelStatus } from '../types';
import StarRating from '../components/StarRating';
import ImageLightbox from '../components/ImageLightbox';

const ModelProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { models, addToCart, user, openLoginModal, isLoadingModels } = useAppContext();

    const model = models.find(m => m.id === id);

    const [selectedIndex, setSelectedIndex] = useState(0); // Index for both gallery and lightbox
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    // Set default product selection once model data is loaded
    React.useEffect(() => {
        if (model && !selectedProductId) {
            setSelectedProductId(model.products[0]?.id || null);
        }
    }, [model, selectedProductId]);

    const allImages = useMemo(() => {
        if (!model) return [];
        return [model.profileImage, ...model.galleryImages];
    }, [model]);
    
    const openLightbox = () => {
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    if (isLoadingModels) {
        return (
            <div className="container mx-auto p-4 md:p-8 text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-pink mx-auto mb-4"></div>
                <h2 className="text-2xl font-semibold text-brand-text-dark">Loading Profile...</h2>
            </div>
        );
    }

    if (!model) {
        return <div className="text-center py-20 text-xl">Model not found.</div>;
    }

    const visibleReviews = model.reviews.filter(review => review.status === 'approved' && !review.isLeadComment);
    const selectedProduct = model.products.find(p => p.id === selectedProductId);
    
    const handleBuyNow = () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (selectedProduct) {
            addToCart({ model, product: selectedProduct });
            navigate('/checkout');
        }
    };
    
    const totalReviews = visibleReviews.length;
    const averageRating = totalReviews > 0
        ? visibleReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    return (
        <div className="container mx-auto p-4 md:p-8 text-brand-text-dark">
            {isLightboxOpen && (
                <ImageLightbox
                    images={allImages}
                    selectedIndex={selectedIndex}
                    onClose={closeLightbox}
                    setSelectedIndex={setSelectedIndex}
                />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                {/* Left Column: Image Gallery */}
                <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[600px]">
                    {/* Thumbnails */}
                    <div className="order-2 md:order-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden]">
                        {allImages.map((img, index) => (
                            <div 
                                key={index} 
                                className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedIndex === index ? 'border-brand-pink' : 'border-transparent hover:border-gray-300'}`}
                                onClick={() => setSelectedIndex(index)}
                            >
                                <img src={img} alt={`thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="md:flex-grow order-1 md:order-2 rounded-lg overflow-hidden cursor-pointer shadow-lg">
                        <img 
                            src={allImages[selectedIndex]} 
                            alt={model.name} 
                            className="w-full h-full object-cover" 
                            onClick={openLightbox}
                        />
                    </div>
                </div>


                {/* Right Column: Info & Purchase */}
                <div className="lg:pt-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold">{model.name}</h1>
                            <p className="text-xl text-gray-500 mt-1">{model.age} years old</p>
                        </div>
                        <StatusIndicator status={model.status} />
                    </div>

                    <div className="flex items-center gap-2 mt-4 mb-6">
                        <StarRating rating={averageRating} />
                        <span className="text-gray-600">({totalReviews} Reviews)</span>
                    </div>

                    {selectedProduct && (
                        <div className="mb-6">
                            <p className="text-5xl font-bold text-brand-text-dark">${selectedProduct.price.toFixed(2)}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <h3 className="block text-sm font-medium text-gray-700 mb-2">
                            Select Your Experience
                        </h3>
                        {model.products.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => setSelectedProductId(product.id)}
                                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ${
                                    selectedProductId === product.id
                                    ? 'bg-pink-50 border-brand-pink shadow-md'
                                    : 'bg-white border-gray-300 hover:border-gray-400'
                                }`}
                                disabled={model.status !== ModelStatus.Online}
                                aria-pressed={selectedProductId === product.id}
                            >
                                <span className={`font-semibold ${selectedProductId === product.id ? 'text-brand-pink' : 'text-brand-text-dark'}`}>
                                    {product.duration} Minute Private Call
                                </span>
                                <span className={`font-bold text-lg ${selectedProductId === product.id ? 'text-brand-text-dark' : 'text-gray-800'}`}>
                                    ${product.price.toFixed(2)}
                                </span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-8">
                        <button
                            onClick={handleBuyNow}
                            disabled={model.status !== ModelStatus.Online || !selectedProductId}
                            className="w-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {model.status === ModelStatus.Online ? 'Book Now & Connect Instantly' : 'Currently Offline'}
                        </button>
                    </div>

                    <p className="text-xs text-center text-gray-500 mt-4">
                        {model.status !== ModelStatus.Online ? `${model.name} is currently offline.` : `Your private, one-on-one call will begin immediately after purchase.`}
                    </p>

                    <div className="border-t border-gray-200 mt-8 pt-6">
                        <h2 className="text-xl font-semibold mb-2">About {model.name}</h2>
                        <p className="text-gray-700 leading-relaxed">{model.bio}</p>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
                <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 border-t-4 border-t-brand-pink">
                    <h2 className="text-2xl font-semibold mb-4 text-brand-pink">
                        What Others Are Saying ({totalReviews})
                    </h2>
                    <div className="flex items-center mb-6 gap-2 border-b border-gray-200 pb-6">
                        <StarRating rating={averageRating} />
                        <span className="font-bold text-lg text-gray-800">{averageRating.toFixed(1)} out of 5</span>
                    </div>

                    <div className="space-y-6 max-h-96 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden]">
                        {totalReviews > 0 ? (
                            visibleReviews.slice().reverse().map((review) => (
                                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                                    <div className="flex items-center mb-2">
                                        {review.profilePic ? (
                                            <img src={review.profilePic} alt={review.username} className="w-10 h-10 rounded-full object-cover mr-3" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center font-bold mr-3 transition-colors">
                                                {review.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-brand-text-dark">{review.username}</p>
                                            <StarRating rating={review.rating} />
                                        </div>
                                    </div>
                                    <p className="text-gray-700 pl-13">{review.comment}</p>
                                    {review.response && (
                                        <div className="mt-3 ml-8 p-3 bg-pink-50 rounded-lg border border-pink-100">
                                            <p className="font-semibold text-sm text-brand-pink">Response from {model.name}</p>
                                            <p className="text-gray-600 text-sm italic">"{review.response}"</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Be the first to share your experience with {model.name}.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelProfile;