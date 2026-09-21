import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as artistService from '../artist.service.js';

describe('Artist Service - NOTA 9', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateArtistData', () => {
    it('deve validar artista com nome válido', () => {
      const result = artistService.validateArtistData({ name: 'Queen' });
      expect(result).toBe(true);
    });

    it('deve lançar erro quando nome é vazio', () => {
      expect(() => artistService.validateArtistData({ name: '' }))
        .toThrow('Nome do artista é obrigatório');
    });

    it('deve lançar erro quando nome é apenas espaços', () => {
      expect(() => artistService.validateArtistData({ name: '   ' }))
        .toThrow('Nome do artista é obrigatório');
    });

    it('deve lançar erro quando nome é muito curto (< 2 caracteres)', () => {
      expect(() => artistService.validateArtistData({ name: 'A' }))
        .toThrow('Nome do artista é obrigatório');
    });

    it('deve lançar erro quando nome não é fornecido', () => {
      expect(() => artistService.validateArtistData({}))
        .toThrow('Nome do artista é obrigatório');
    });

    it('deve lançar erro quando nome é null', () => {
      expect(() => artistService.validateArtistData({ name: null }))
        .toThrow('Nome do artista é obrigatório');
    });

    it('deve lançar erro quando nome é undefined', () => {
      expect(() => artistService.validateArtistData({ name: undefined }))
        .toThrow('Nome do artista é obrigatório');
    });

    it('deve aceitar nome com exatamente 2 caracteres', () => {
      const result = artistService.validateArtistData({ name: 'AB' });
      expect(result).toBe(true);
    });

    it('deve aceitar nome com caracteres especiais', () => {
      const result = artistService.validateArtistData({
        name: 'The Beatles'
      });
      expect(result).toBe(true);
    });

    it('deve aceitar nome com números', () => {
      const result = artistService.validateArtistData({
        name: 'U2'
      });
      expect(result).toBe(true);
    });

    it('deve aceitar nome com hífen', () => {
      const result = artistService.validateArtistData({
        name: 'AC-DC'
      });
      expect(result).toBe(true);
    });

    it('deve aceitar nome longo', () => {
      const longName = 'A'.repeat(100);
      const result = artistService.validateArtistData({ name: longName });
      expect(result).toBe(true);
    });

    it('deve validar artista com dados adicionais', () => {
      const result = artistService.validateArtistData({
        name: 'Pink Floyd',
        country: 'Reino Unido',
        genre: 'Rock',
        foundedYear: 1965
      });
      expect(result).toBe(true);
    });

    it('deve rejeitar nome com espaço apenas no início', () => {
      expect(() => artistService.validateArtistData({ name: ' A' }))
        .toThrow('Nome do artista é obrigatório');
    });

    it('deve rejeitar nome com espaço apenas no fim', () => {
      expect(() => artistService.validateArtistData({ name: 'A ' }))
        .toThrow('Nome do artista é obrigatório');
    });

    it('deve aceitar nome com múltiplos espaços entre palavras', () => {
      const result = artistService.validateArtistData({
        name: 'The   Beatles'
      });
      expect(result).toBe(true);
    });
  });

  describe('canManageArtists', () => {
    it('deve retornar true para usuário admin', () => {
      const admin = { id: 1, name: 'Admin', role: 'admin' };
      expect(artistService.canManageArtists(admin)).toBe(true);
    });

    it('deve retornar false para usuário comum', () => {
      const user = { id: 2, name: 'João', role: 'user' };
      expect(artistService.canManageArtists(user)).toBe(false);
    });

    it('deve retornar false para usuário moderator', () => {
      const moderator = { id: 3, name: 'Moderador', role: 'moderator' };
      expect(artistService.canManageArtists(moderator)).toBe(false);
    });

    it('deve retornar false para null', () => {
      expect(artistService.canManageArtists(null)).toBe(false);
    });

    it('deve retornar false para undefined', () => {
      expect(artistService.canManageArtists(undefined)).toBe(false);
    });

    it('deve retornar false quando user não tem role', () => {
      const user = { id: 4, name: 'Sem role' };
      expect(artistService.canManageArtists(user)).toBe(false);
    });

    it('deve ser case-sensitive (apenas "admin")', () => {
      const cases = [
        { user: { role: 'admin' }, expected: true },
        { user: { role: 'ADMIN' }, expected: false },
        { user: { role: 'Admin' }, expected: false }
      ];

      cases.forEach(({ user, expected }) => {
        expect(artistService.canManageArtists(user)).toBe(expected);
      });
    });

    it('deve trabalhar com objeto de usuário completo', () => {
      const admin = {
        id: 10,
        name: 'Admin User',
        email: 'admin@musicvibe.com',
        role: 'admin',
        createdAt: new Date(),
        isActive: true
      };
      expect(artistService.canManageArtists(admin)).toBe(true);
    });
  });

  describe('filterActiveArtists', () => {
    it('deve retornar apenas artistas ativos (active !== false)', () => {
      const artists = [
        { id: 1, name: 'Artist 1', active: true },
        { id: 2, name: 'Artist 2', active: false },
        { id: 3, name: 'Artist 3', active: true }
      ];

      const result = artistService.filterActiveArtists(artists);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('deve retornar artistas sem field active como ativos', () => {
      const artists = [
        { id: 1, name: 'Artist 1' },
        { id: 2, name: 'Artist 2', active: false },
        { id: 3, name: 'Artist 3' }
      ];

      const result = artistService.filterActiveArtists(artists);
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: 1, name: 'Artist 1' },
        { id: 3, name: 'Artist 3' }
      ]);
    });

    it('deve retornar array vazio quando todos estão inativos', () => {
      const artists = [
        { id: 1, name: 'Artist 1', active: false },
        { id: 2, name: 'Artist 2', active: false }
      ];

      const result = artistService.filterActiveArtists(artists);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('deve retornar todos quando todos estão ativos', () => {
      const artists = [
        { id: 1, name: 'Artist 1', active: true },
        { id: 2, name: 'Artist 2', active: true }
      ];

      const result = artistService.filterActiveArtists(artists);
      expect(result).toHaveLength(2);
    });

    it('deve trabalhar com array vazio', () => {
      const result = artistService.filterActiveArtists([]);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('deve manter ordem original dos artistas', () => {
      const artists = [
        { id: 5, name: 'Fifth', active: true },
        { id: 2, name: 'Second', active: false },
        { id: 1, name: 'First', active: true },
        { id: 3, name: 'Third', active: true }
      ];

      const result = artistService.filterActiveArtists(artists);
      expect(result).toEqual([
        { id: 5, name: 'Fifth', active: true },
        { id: 1, name: 'First', active: true },
        { id: 3, name: 'Third', active: true }
      ]);
    });

    it('deve preservar todos os campos dos artistas filtrados', () => {
      const artists = [
        { id: 1, name: 'Artist 1', active: true, country: 'Brazil', genre: 'Samba' },
        { id: 2, name: 'Artist 2', active: false, country: 'USA', genre: 'Jazz' }
      ];

      const result = artistService.filterActiveArtists(artists);
      expect(result[0]).toEqual({
        id: 1,
        name: 'Artist 1',
        active: true,
        country: 'Brazil',
        genre: 'Samba'
      });
    });
  });
});
