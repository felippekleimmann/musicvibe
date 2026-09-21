import { describe, it, expect } from 'vitest';
import { buildDashboardStats, canAccessDashboard } from '../dashboard.service.js';
describe('Dashboard Service', () => { it('deve montar estatísticas', () => { const stats = buildDashboardStats({users:[1],tracks:[{playCount:10},{playCount:5}],artists:[1,2],playlists:[1]}); expect(stats.totalUsers).toBe(1); expect(stats.totalTracks).toBe(2); expect(stats.totalPlays).toBe(15); }); it('deve permitir dashboard apenas para admin', () => expect(canAccessDashboard({role:'admin'})).toBe(true)); });
