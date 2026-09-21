import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as albumService from '../album.service.js';

describe('Album Service - NOTA 9', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateAlbumData', () => {
    it('deve validar dados válidos de álbum', () => {
      const result = albumService.validateAlbumData({
        title: 'Abbey Road',
        artistId: 1
      });
      expect(result).toBe(true);
    });

    it('deve lançar erro quando título é vazio', () => {
      expect(() => albumService.validateAlbumData({
        title: '',
        artistId: 1
      })).toThrow('Título do álbum é obrigatório');
    });

    it('deve lançar erro quando título é apenas espaços', () => {
      expect(() => albumService.validateAlbumData({
        title: '   ',
        artistId: 1
      })).toThrow('Título do álbum é obrigatório');
    });

    it('deve lançar erro quando título é muito curto (< 2 caracteres)', () => {
      expect(() => albumService.validateAlbumData({
        title: 'A',
        artistId: 1
      })).toThrow('Título do álbum é obrigatório');
    });

    it('deve lançar erro quando título não é fornecido', () => {
      expect(() => albumService.validateAlbumData({
        artistId: 1
      })).toThrow('Título do álbum é obrigatório');
    });

    it('deve lançar erro quando artistId não é fornecido', () => {
      expect(() => albumService.validateAlbumData({
        title: 'Abbey Road'
      })).toThrow('Artista é obrigatório');
    });

    it('deve lançar erro quando artistId é null', () => {
      expect(() => albumService.validateAlbumData({
        title: 'Abbey Road',
        artistId: null
      })).toThrow('Artista é obrigatório');
    });

    it('deve lançar erro quando artistId é zero', () => {
      expect(() => albumService.validateAlbumData({
        title: 'Abbey Road',
        artistId: 0
      })).toThrow('Artista é obrigatório');
    });

    it('deve lançar erro quando artistId é undefined', () => {
      expect(() => albumService.validateAlbumData({
        title: 'Abbey Road',
        artistId: undefined
      })).toThrow('Artista é obrigatório');
    });

    it('deve aceitar título com exatamente 2 caracteres', () => {
      const result = albumService.validateAlbumData({
        title: 'AB',
        artistId: 1
      });
      expect(result).toBe(true);
    });

    it('deve aceitar artistId como número positivo', () => {
      const result = albumService.validateAlbumData({
        title: 'Abbey Road',
        artistId: 1
      });
      expect(result).toBe(true);
    });

    it('deve aceitar título com caracteres especiais', () => {
      const result = albumService.validateAlbumData({
        title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
        artistId: 1
      });
      expect(result).toBe(true);
    });

    it('deve aceitar título com números', () => {
      const result = albumService.validateAlbumData({
        title: 'The Dark Side of the Moon (2023)',
        artistId: 1
      });
      expect(result).toBe(true);
    });

    it('deve rejeitar título com apenas um caractere visível', () => {
      expect(() => albumService.validateAlbumData({
        title: ' A ',
        artistId: 1
      })).toThrow('Título do álbum é obrigatório');
    });

    it('deve validar com objeto completo de álbum', () => {
      const result = albumService.validateAlbumData({
        title: 'Dark Side of the Moon',
        artistId: 2,
        releaseDate: '1973-03-01',
        genre: 'Progressive Rock'
      });
      expect(result).toBe(true);
    });
  });

  describe('canManageAlbums', () => {
    it('deve retornar true para usuário admin', () => {
      const admin = { id: 1, name: 'Admin', role: 'admin' };
      expect(albumService.canManageAlbums(admin)).toBe(true);
    });

    it('deve retornar false para usuário comum', () => {
      const user = { id: 2, name: 'João', role: 'user' };
      expect(albumService.canManageAlbums(user)).toBe(false);
    });

    it('deve retornar false para usuário moderator', () => {
      const moderator = { id: 3, name: 'Moderador', role: 'moderator' };
      expect(albumService.canManageAlbums(moderator)).toBe(false);
    });

    it('deve retornar false para usuário guest', () => {
      const guest = { id: 4, name: 'Visitante', role: 'guest' };
      expect(albumService.canManageAlbums(guest)).toBe(false);
    });

    it('deve retornar false para null', () => {
      expect(albumService.canManageAlbums(null)).toBe(false);
    });

    it('deve retornar false para undefined', () => {
      expect(albumService.canManageAlbums(undefined)).toBe(false);
    });

    it('deve retornar false quando user não tem role', () => {
      const user = { id: 5, name: 'Sem role' };
      expect(albumService.canManageAlbums(user)).toBe(false);
    });

    it('deve retornar true apenas com role === "admin" (case-sensitive)', () => {
      const cases = [
        { user: { role: 'admin' }, expected: true },
        { user: { role: 'ADMIN' }, expected: false },
        { user: { role: 'Admin' }, expected: false },
        { user: { role: 'adm' }, expected: false },
        { user: { role: ' admin' }, expected: false }
      ];

      cases.forEach(({ user, expected }) => {
        expect(albumService.canManageAlbums(user)).toBe(expected);
      });
    });

    it('deve funcionar com usuário contendo vários campos', () => {
      const admin = {
        id: 10,
        name: 'Super Admin',
        email: 'admin@musicvibe.com',
        role: 'admin',
        createdAt: new Date(),
        isActive: true
      };
      expect(albumService.canManageAlbums(admin)).toBe(true);
    });
  });
});
