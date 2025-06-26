import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';

type Rating = {
  _id: string;
  rating: number;
  review?: string;
  user: {
    name: string;
  };
  createdAt: string;
};

type DoctorRatingsProps = {
  doctorId: string;
};

const DoctorRatings: React.FC<DoctorRatingsProps> = ({ doctorId }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    fetchRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, page]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/ratings/doctor/${doctorId}?page=${page}&limit=5`);
      const data = await response.json();

      if (data.success) {
        if (page === 1) {
          setRatings(data.ratings);
        } else {
          setRatings((prev) => [...prev, ...data.ratings]);
        }
        setHasMore(data.pagination.hasMore);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (loading && page === 1) {
    return <div className="text-center py-4">Loading ratings...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Patient Reviews</h3>

      {ratings.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <>
          {ratings.map((rating) => (
            <div key={rating._id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <RatingStars rating={rating.rating} readonly size="small" />
                    <span className="text-sm text-gray-600">{rating.rating}/5</span>
                  </div>
                  <p className="text-sm text-gray-600">By {rating.user?.name || 'Anonymous'}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>

              {rating.review && <p className="text-gray-700 mt-2">{rating.review}</p>}
            </div>
          ))}

          {hasMore && (
            <button
              onClick={loadMore}
              className="w-full bg-blue-50 text-blue-600 py-2 rounded-md hover:bg-blue-100"
            >
              Load More Reviews
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorRatings;
