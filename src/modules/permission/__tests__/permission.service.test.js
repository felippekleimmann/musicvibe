import { describe, it, expect } from 'vitest';
import { hasPermission } from '../permission.service.js';
describe('Permission Service', () => { it('deve liberar admin', () => expect(hasPermission({role:'admin'}, {}, 'delete')).toBe(true)); it('deve liberar leitura autenticada', () => expect(hasPermission({id:1}, {}, 'read')).toBe(true)); it('deve liberar update ao dono', () => expect(hasPermission({id:1}, {userId:1}, 'update')).toBe(true)); });
