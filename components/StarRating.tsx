import React from 'react';
import { StarIcon } from './Icons';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            filled={starValue <= rating}
            className="w-5 h-5 text-brand-gold"
          />
        );
      })}
    </div>
  );
};

export default StarRating;
