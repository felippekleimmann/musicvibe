import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validatePlaylistData,
  canEditPlaylist,
  canViewPlaylist,
  canAddTrackToPlaylist,
  createPlaylist,
  getPlaylistById,
  listPlaylistsByUser,
  listPublicPlaylists,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  deletePlaylist,
} from '../playlist.service.js';

vi.mock('../../../models/Playlist.js', () => ({
  Playlist: {
    create: vi.fn(),
    findByPk: vi.fn(),
    findAll: vi.fn(),
    rawAttributes: {
      name: { type: 'STRING' },
      description: { type: 'TEXT' },
      visibility: { type: 'ENUM' },
    },
  },
}));

vi.mock('../../../models/PlaylistTrack.js', () => ({
  PlaylistTrack: {
    create: vi.fn(),
    findOne: vi.fn(),
    destroy: vi.fn(),
  },
}));

vi.mock('../../../models/Track.js', () => ({
  Track: {
    findByPk: vi.fn(),
  },
}));

import { Playlist } from '../../../models/Playlist.js';
import { PlaylistTrack } from '../../../models/PlaylistTrack.js';
import { Track } from '../../../models/Track.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('validatePlaylistData', () => {
  it('deve retornar true para dados válidos', () => {
    expect(validatePlaylistData({ name: 'Minha playlist', userId: 1 })).toBe(true);
  });

  it('deve lançar erro quando o nome está ausente', () => {
    expect(() => validatePlaylistData({ userId: 1 })).toThrow('Nome da playlist é obrigatório');
  });

  it('deve lançar erro quando o nome é muito curto', () => {
    expect(() => validatePlaylistData({ name: 'ab', userId: 1 })).toThrow('Nome da playlist é obrigatório');
  });

  it('deve lançar erro quando o userId está ausente', () => {
    expect(() => validatePlaylistData({ name: 'Minha playlist' })).toThrow('Usuário é obrigatório');
  });
});

describe('canEditPlaylist', () => {
  it('deve permitir que o dono edite a playlist', () => {
    expect(canEditPlaylist({ id: 1 }, { userId: 1 })).toBe(true);
  });

  it('deve permitir que um admin edite qualquer playlist', () => {
    expect(canEditPlaylist({ id: 99, role: 'admin' }, { userId: 1 })).toBe(true);
  });

  it('deve negar edição para usuário que não é dono nem admin', () => {
    expect(canEditPlaylist({ id: 2, role: 'user' }, { userId: 1 })).toBe(false);
  });

  it('deve negar edição quando não há usuário autenticado', () => {
    expect(canEditPlaylist(null, { userId: 1 })).toBe(false);
  });
});

describe('canViewPlaylist', () => {
  it('deve permitir visualizar playlist pública mesmo sem usuário autenticado', () => {
    expect(canViewPlaylist(null, { visibility: 'public', userId: 1 })).toBe(true);
  });

  it('deve permitir que o dono visualize sua playlist privada', () => {
    expect(canViewPlaylist({ id: 1 }, { visibility: 'private', userId: 1 })).toBe(true);
  });

  it('deve negar visualização de playlist privada de outro usuário', () => {
    expect(canViewPlaylist({ id: 2 }, { visibility: 'private', userId: 1 })).toBe(false);
  });
});

describe('canAddTrackToPlaylist', () => {
  it('deve permitir que o dono adicione música', () => {
    expect(canAddTrackToPlaylist({ id: 1 }, { userId: 1 })).toBe(true);
  });

  it('deve negar adição de música por quem não é dono', () => {
    expect(canAddTrackToPlaylist({ id: 2 }, { userId: 1 })).toBe(false);
  });
});

describe('createPlaylist', () => {
  it('deve criar playlist com dados válidos', async () => {
    Playlist.create.mockResolvedValue({ id: 1, name: 'Rock Clássico', UserId: 1, visibility: 'private' });

    const result = await createPlaylist({ name: 'Rock Clássico', userId: 1 });

    expect(Playlist.create).toHaveBeenCalledWith({
      name: 'Rock Clássico',
      description: undefined,
      visibility: 'private',
      UserId: 1,
    });
    expect(result).toHaveProperty('id', 1);
  });

  it('deve criar playlist pública quando visibility for informado', async () => {
    Playlist.create.mockResolvedValue({ id: 2, name: 'Hits 2026', UserId: 1, visibility: 'public' });

    await createPlaylist({ name: 'Hits 2026', userId: 1, visibility: 'public' });

    expect(Playlist.create).toHaveBeenCalledWith(expect.objectContaining({ visibility: 'public' }));
  });

  it('deve lançar erro e não chamar o model quando o nome é inválido', async () => {
    await expect(createPlaylist({ userId: 1 })).rejects.toThrow('Nome da playlist é obrigatório');
    expect(Playlist.create).not.toHaveBeenCalled();
  });
});

describe('getPlaylistById', () => {
  it('deve retornar a playlist quando encontrada', async () => {
    Playlist.findByPk.mockResolvedValue({ id: 1, name: 'Favoritas' });

    const result = await getPlaylistById(1);

    expect(result).toHaveProperty('name', 'Favoritas');
    expect(Playlist.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('deve retornar null quando a playlist não existe', async () => {
    Playlist.findByPk.mockResolvedValue(null);

    const result = await getPlaylistById(999);

    expect(result).toBeNull();
  });

  it('deve lançar erro quando o id não é informado', async () => {
    await expect(getPlaylistById()).rejects.toThrow('ID é obrigatório');
  });
});

describe('listPlaylistsByUser', () => {
  it('deve retornar as playlists do usuário', async () => {
    Playlist.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await listPlaylistsByUser(1);

    expect(result).toHaveLength(2);
    expect(Playlist.findAll).toHaveBeenCalledWith({ where: { UserId: 1 } });
  });

  it('deve lançar erro quando o userId não é informado', async () => {
    await expect(listPlaylistsByUser()).rejects.toThrow('Usuário é obrigatório');
  });
});

describe('listPublicPlaylists', () => {
  it('deve retornar somente playlists públicas', async () => {
    Playlist.findAll.mockResolvedValue([{ id: 1, visibility: 'public' }]);

    const result = await listPublicPlaylists();

    expect(Playlist.findAll).toHaveBeenCalledWith({ where: { visibility: 'public' } });
    expect(result).toEqual([{ id: 1, visibility: 'public' }]);
  });
});

describe('addTrackToPlaylist', () => {
  it('deve adicionar música quando playlist e música existem e usuário tem permissão', async () => {
    Playlist.findByPk.mockResolvedValue({ id: 1, userId: 1 });
    Track.findByPk.mockResolvedValue({ id: 5, title: 'Música Teste' });
    PlaylistTrack.findOne.mockResolvedValue(null);
    PlaylistTrack.create.mockResolvedValue({ id: 10, PlaylistId: 1, TrackId: 5 });

    const result = await addTrackToPlaylist({ id: 1 }, 1, 5);

    expect(PlaylistTrack.create).toHaveBeenCalledWith({ PlaylistId: 1, TrackId: 5 });
    expect(result).toHaveProperty('id', 10);
  });

  it('deve lançar erro quando a playlist não existe', async () => {
    Playlist.findByPk.mockResolvedValue(null);

    await expect(addTrackToPlaylist({ id: 1 }, 99, 5)).rejects.toThrow('Playlist não encontrada');
    expect(PlaylistTrack.create).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando o usuário não tem permissão para editar a playlist', async () => {
    Playlist.findByPk.mockResolvedValue({ id: 1, userId: 2 });

    await expect(addTrackToPlaylist({ id: 1 }, 1, 5)).rejects.toThrow('Sem permissão para editar esta playlist');
    expect(PlaylistTrack.create).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a música não existe', async () => {
    Playlist.findByPk.mockResolvedValue({ id: 1, userId: 1 });
    Track.findByPk.mockResolvedValue(null);

    await expect(addTrackToPlaylist({ id: 1 }, 1, 999)).rejects.toThrow('Música não encontrada');
  });

  it('deve lançar erro quando a música já está na playlist', async () => {
    Playlist.findByPk.mockResolvedValue({ id: 1, userId: 1 });
    Track.findByPk.mockResolvedValue({ id: 5 });
    PlaylistTrack.findOne.mockResolvedValue({ id: 10, PlaylistId: 1, TrackId: 5 });

    await expect(addTrackToPlaylist({ id: 1 }, 1, 5)).rejects.toThrow('Música já está na playlist');
    expect(PlaylistTrack.create).not.toHaveBeenCalled();
  });
});

describe('removeTrackFromPlaylist', () => {
  it('deve remover a música da playlist com sucesso', async () => {
    Playlist.findByPk.mockResolvedValue({ id: 1, userId: 1 });
    const destroy = vi.fn().mockResolvedValue();
    PlaylistTrack.findOne.mockResolvedValue({ id: 10, destroy });

    await removeTrackFromPlaylist({ id: 1 }, 1, 5);

    expect(destroy).toHaveBeenCalled();
  });

  it('deve lançar erro quando a playlist não existe', async () => {
    Playlist.findByPk.mockResolvedValue(null);

    await expect(removeTrackFromPlaylist({ id: 1 }, 99, 5)).rejects.toThrow('Playlist não encontrada');
  });

  it('deve lançar erro quando a música não está na playlist', async () => {
    Playlist.findByPk.mockResolvedValue({ id: 1, userId: 1 });
    PlaylistTrack.findOne.mockResolvedValue(null);

    await expect(removeTrackFromPlaylist({ id: 1 }, 1, 5)).rejects.toThrow('Música não está na playlist');
  });
});

describe('deletePlaylist', () => {
  it('deve excluir a playlist quando o usuário é o dono', async () => {
    const destroy = vi.fn().mockResolvedValue();
    Playlist.findByPk.mockResolvedValue({ id: 1, userId: 1, destroy });

    await deletePlaylist({ id: 1 }, 1);

    expect(destroy).toHaveBeenCalled();
  });

  it('deve lançar erro quando a playlist não existe', async () => {
    Playlist.findByPk.mockResolvedValue(null);

    await expect(deletePlaylist({ id: 1 }, 999)).rejects.toThrow('Playlist não encontrada');
  });

  it('deve lançar erro quando o usuário não tem permissão para excluir', async () => {
    Playlist.findByPk.mockResolvedValue({ id: 1, userId: 2 });

    await expect(deletePlaylist({ id: 1, role: 'user' }, 1)).rejects.toThrow('Sem permissão para editar esta playlist');
  });
});

describe('Playlist Model', () => {
  it('deve possuir o atributo name', () => {
    expect(Playlist.rawAttributes.name).toBeDefined();
  });

  it('deve possuir o atributo visibility', () => {
    expect(Playlist.rawAttributes.visibility).toBeDefined();
  });
});
