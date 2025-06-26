import React, { useState } from 'react';

type RatingStarsProps = {
  rating: number;
  setRating?: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
};

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  setRating,
  readonly = false,
  size = 'medium',
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const sizeClasses: Record<'small' | 'medium' | 'large', string> = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  const handleStarClick = (starIndex: number) => {
    if (!readonly && setRating) {
      setRating(starIndex);
    }
  };

  const handleStarHover = (starIndex: number) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center space-x-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizeClasses[size]} ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } transition-transform`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          disabled={readonly}
        >
          <svg
            className={`w-full h-full ${
              star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
