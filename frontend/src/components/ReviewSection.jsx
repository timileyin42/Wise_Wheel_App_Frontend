import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import { getReviews, createReview } from '../../services/review';

export default function ReviewSection({ carId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviews(carId);
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [carId]);

  const handleSubmit = async () => {
    if (!comment) return;
    
    try {
      setSubmitting(true);
      const newReview = await createReview({
        car_id: carId,
        rating,
        comment
      });
      setReviews([newReview, ...reviews]);
      setComment('');
      setRating(5);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>

      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Write a Review
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          size="large"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Your review"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !comment}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {loading ? (
        <Typography>Loading reviews...</Typography>
      ) : reviews.length === 0 ? (
        <Typography>No reviews yet. Be the first to review!</Typography>
      ) : (
        reviews.map((review) => (
          <Box key={review.id} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar src={review.user?.profile_image} sx={{ mr: 2 }} />
              <Box>
                <Typography fontWeight="bold">
                  {review.user?.name || 'Anonymous'}
                </Typography>
                <Rating value={review.rating} readOnly size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                {new Date(review.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography sx={{ pl: 7 }}>{review.comment}</Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))
      )}
    </Box>
  );
}
