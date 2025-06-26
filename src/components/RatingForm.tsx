import React, { useState, FormEvent } from 'react';
import RatingStars from './RatingStars';

type RatingData = {
  rating: number;
  review: string;
};

type RatingFormProps = {
  doctorId: string;
  appointmentId: string;
  existingRating?: RatingData;
  onSubmit?: (data: any) => void;
  onCancel: () => void;
};

const RatingForm: React.FC<RatingFormProps> = ({
  doctorId,
  appointmentId,
  existingRating,
  onSubmit,
  onCancel,
}) => {
  const [rating, setRating] = useState<number>(existingRating?.rating || 0);
  const [review, setReview] = useState<string>(existingRating?.review || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ratings/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          doctor_id: doctorId,
          appointment_id: appointmentId,
          rating,
          review,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSubmit?.(data);
        alert('Rating submitted successfully!');
      } else {
        alert(data.message || 'Error submitting rating');
      }
    } catch (error) {
      console.error('Rating submission error:', error);
      alert('Error submitting rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <RatingStars rating={rating} setRating={setRating} size="large" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Share your experience with this doctor..."
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingForm;
