import { describe, it, expect } from 'vitest';
import { validateLoginData, canAccessProtectedRoute, canAccessAdminRoute } from '../auth.service.js';
describe('Auth Service', () => { it('deve validar login', () => expect(validateLoginData({ email: 'a@b.com', password: '123456' })).toBe(true)); it('deve bloquear login sem senha', () => expect(() => validateLoginData({ email: 'a@b.com' })).toThrow('Senha')); it('deve controlar acesso admin', () => { expect(canAccessProtectedRoute({ user: { id: 1 } })).toBe(true); expect(canAccessAdminRoute({ user: { role: 'admin' } })).toBe(true); }); });
