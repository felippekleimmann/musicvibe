import { describe, it, expect } from 'vitest';
import { validateReviewData, canDeleteReview, averageRating } from '../review.service.js';
import { Review } from '../../../models/Review.js';
describe('Review Service', () => { it('deve validar avaliação', () => expect(validateReviewData({rating:5,userId:1,trackId:2})).toBe(true)); it('deve rejeitar nota inválida', () => expect(() => validateReviewData({rating:6,userId:1,trackId:2})).toThrow()); it('deve calcular média', () => expect(averageRating([{rating:5},{rating:3}])).toBe(4)); it('deve permitir exclusão pelo autor', () => expect(canDeleteReview({id:1},{userId:1})).toBe(true)); });
describe('Review Model', () => { it('deve possuir rating', () => expect(Review.rawAttributes.rating).toBeDefined()); });
