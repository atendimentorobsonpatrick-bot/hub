import React, { useEffect, useCallback } from 'react';

interface ImageLightboxProps {
  images: string[];
  selectedIndex: number;
  onClose: () => void;
  setSelectedIndex: (index: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, selectedIndex, onClose, setSelectedIndex }) => {
  const handleNext = useCallback(() => {
    setSelectedIndex((selectedIndex + 1) % images.length);
  }, [selectedIndex, images.length, setSelectedIndex]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  }, [selectedIndex, images.length, setSelectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, handleNext, handlePrev]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-50"
        aria-label="Close lightbox"
      >
        &times;
      </button>

      <button 
        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        className="absolute left-4 text-white text-4xl bg-black/30 p-2 rounded-full hover:bg-black/50 z-50"
        aria-label="Previous image"
      >
        &#8249;
      </button>

      <button 
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        className="absolute right-4 text-white text-4xl bg-black/30 p-2 rounded-full hover:bg-black/50 z-50"
        aria-label="Next image"
      >
        &#8250;
      </button>

      <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        <img 
          src={images[selectedIndex]} 
          alt={`Gallery view ${selectedIndex + 1}`}
          className="w-full h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default ImageLightbox;
