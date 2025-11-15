

import React, { useState } from 'react';
import { StarIcon } from './Icons';

interface InteractiveStarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  totalStars?: number;
  disabled?: boolean;
}

const InteractiveStarRating: React.FC<InteractiveStarRatingProps> = ({ rating, setRating, totalStars = 5, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={`flex items-center space-x-1 ${disabled ? 'opacity-50' : ''}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => !disabled && setRating(starValue)}
            onMouseEnter={() => !disabled && setHoverRating(starValue)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            disabled={disabled}
            className="focus:outline-none"
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <StarIcon
              filled={starValue <= (hoverRating || rating)}
              className={`w-10 h-10 text-brand-gold ${!disabled ? 'cursor-pointer transition-transform transform hover:scale-125' : 'cursor-not-allowed'}`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default InteractiveStarRating;