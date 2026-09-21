import { describe, it, expect } from 'vitest';
import { validatePlayback, validateProgress, isTrackFinished } from '../playback.service.js';
describe('Playback Service', () => { it('deve validar reprodução', () => expect(validatePlayback({userId:1,trackId:2})).toBe(true)); it('deve impedir progresso maior que duração', () => expect(() => validateProgress(130,120)).toThrow()); it('deve identificar faixa finalizada', () => expect(isTrackFinished(120,120)).toBe(true)); });
