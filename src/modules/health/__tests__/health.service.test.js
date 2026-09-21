import { describe, it, expect } from 'vitest';
import { getHealth } from '../health.service.js';
describe('Health Service', () => { it('deve retornar status OK', () => { const result = getHealth(); expect(result.status).toBe('OK'); expect(result.message).toContain('MusicVibe'); expect(result).toHaveProperty('timestamp'); }); });
