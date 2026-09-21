import { describe, it, expect } from 'vitest';
import { validateGenreData, canManageGenres, filterActiveGenres } from '../genre.service.js';
import { Genre } from '../../../models/Genre.js';
describe('Genre Service', () => { it('deve validar gênero', () => expect(validateGenreData({ name:'Rock' })).toBe(true)); it('deve rejeitar gênero curto', () => expect(() => validateGenreData({ name:'R' })).toThrow()); it('deve filtrar ativos', () => expect(filterActiveGenres([{active:true},{active:false}])).toHaveLength(1)); it('deve permitir admin', () => expect(canManageGenres({role:'admin'})).toBe(true)); });
describe('Genre Model', () => { it('deve possuir nome', () => expect(Genre.rawAttributes.name).toBeDefined()); });
