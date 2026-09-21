export const validateReviewData = ({ rating, userId, trackId }) => { if (!userId) throw new Error('Usuário é obrigatório'); if (!trackId) throw new Error('Música é obrigatória'); if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('Avaliação deve ser entre 1 e 5'); return true; };
export const canDeleteReview = (user, review) => user?.role === 'admin' || user?.id === review?.userId;
export const averageRating = (reviews) => reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
