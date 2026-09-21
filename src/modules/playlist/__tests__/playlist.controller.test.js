import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../app.js';
import * as playlistService from '../playlist.service.js';
import { isAuthenticated } from '../../../middlewares/auth.middleware.js';

vi.mock('../playlist.service.js', () => ({
  listPublicPlaylists: vi.fn(),
  listPlaylistsByUser: vi.fn(),
  createPlaylist: vi.fn(),
  getPlaylistById: vi.fn(),
  canViewPlaylist: vi.fn(),
  addTrackToPlaylist: vi.fn(),
  removeTrackFromPlaylist: vi.fn(),
  deletePlaylist: vi.fn(),
}));

// Por padrão, simula um usuário autenticado injetando a sessão.
// Cada teste de cenário "não autenticado" sobrescreve esse mock para devolver 401,
// reproduzindo o comportamento real do middleware isAuthenticated.
vi.mock('../../../middlewares/auth.middleware.js', () => ({
  isAuthenticated: vi.fn((req, res, next) => {
    req.session.user = { id: 1, role: 'user' };
    next();
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  isAuthenticated.mockImplementation((req, res, next) => {
    req.session.user = { id: 1, role: 'user' };
    next();
  });
});

describe('GET /playlist', () => {
  it('deve retornar 200 com a lista de playlists públicas', async () => {
    playlistService.listPublicPlaylists.mockResolvedValue([{ id: 1, name: 'Hits', visibility: 'public' }]);

    const response = await request(app).get('/playlist');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(playlistService.listPublicPlaylists).toHaveBeenCalled();
  });

  it('deve retornar 500 quando o service lança um erro inesperado', async () => {
    playlistService.listPublicPlaylists.mockRejectedValue(new Error('Falha de banco de dados'));

    const response = await request(app).get('/playlist');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Falha de banco de dados');
  });
});

describe('GET /playlist/mine', () => {
  it('deve retornar 401 quando o usuário não está autenticado', async () => {
    isAuthenticated.mockImplementation((req, res) => res.status(401).json({ error: 'Usuário não autenticado' }));

    const response = await request(app).get('/playlist/mine');

    expect(response.status).toBe(401);
    expect(playlistService.listPlaylistsByUser).not.toHaveBeenCalled();
  });

  it('deve retornar 200 com as playlists do usuário autenticado', async () => {
    playlistService.listPlaylistsByUser.mockResolvedValue([{ id: 2, name: 'Minhas favoritas' }]);

    const response = await request(app).get('/playlist/mine');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(playlistService.listPlaylistsByUser).toHaveBeenCalledWith(1);
  });
});

describe('POST /playlist', () => {
  it('deve retornar 401 quando o usuário não está autenticado', async () => {
    isAuthenticated.mockImplementation((req, res) => res.status(401).json({ error: 'Usuário não autenticado' }));

    const response = await request(app).post('/playlist').send({ name: 'Rock' });

    expect(response.status).toBe(401);
    expect(playlistService.createPlaylist).not.toHaveBeenCalled();
  });

  it('deve criar a playlist e retornar 201 quando os dados são válidos', async () => {
    playlistService.createPlaylist.mockResolvedValue({ id: 3, name: 'Pop Hits', UserId: 1 });

    const response = await request(app).post('/playlist').send({ name: 'Pop Hits' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Playlist criada com sucesso');
    expect(response.body.playlist).toHaveProperty('id', 3);
    expect(playlistService.createPlaylist).toHaveBeenCalledWith({ name: 'Pop Hits', userId: 1 });
  });

  it('deve retornar 400 quando o nome da playlist é inválido', async () => {
    playlistService.createPlaylist.mockRejectedValue(new Error('Nome da playlist é obrigatório'));

    const response = await request(app).post('/playlist').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Nome da playlist é obrigatório');
  });
});

describe('GET /playlist/:id', () => {
  it('deve retornar 200 quando a playlist existe e é visível para o usuário', async () => {
    playlistService.getPlaylistById.mockResolvedValue({ id: 1, name: 'Favoritas', visibility: 'public' });
    playlistService.canViewPlaylist.mockReturnValue(true);

    const response = await request(app).get('/playlist/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('deve retornar 404 quando a playlist não existe', async () => {
    playlistService.getPlaylistById.mockResolvedValue(null);

    const response = await request(app).get('/playlist/999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Playlist não encontrada');
  });

  it('deve retornar 403 quando a playlist é privada e o usuário não tem permissão', async () => {
    playlistService.getPlaylistById.mockResolvedValue({ id: 1, name: 'Privada', visibility: 'private', userId: 2 });
    playlistService.canViewPlaylist.mockReturnValue(false);

    const response = await request(app).get('/playlist/1');

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });
});

describe('POST /playlist/:id/tracks', () => {
  it('deve retornar 401 quando o usuário não está autenticado', async () => {
    isAuthenticated.mockImplementation((req, res) => res.status(401).json({ error: 'Usuário não autenticado' }));

    const response = await request(app).post('/playlist/1/tracks').send({ trackId: 5 });

    expect(response.status).toBe(401);
  });

  it('deve retornar 201 quando a música é adicionada com sucesso', async () => {
    playlistService.addTrackToPlaylist.mockResolvedValue({ id: 10, PlaylistId: 1, TrackId: 5 });

    const response = await request(app).post('/playlist/1/tracks').send({ trackId: 5 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Música adicionada à playlist');
    expect(playlistService.addTrackToPlaylist).toHaveBeenCalledWith({ id: 1, role: 'user' }, '1', 5);
  });

  it('deve retornar 404 quando a playlist não existe', async () => {
    playlistService.addTrackToPlaylist.mockRejectedValue(new Error('Playlist não encontrada'));

    const response = await request(app).post('/playlist/999/tracks').send({ trackId: 5 });

    expect(response.status).toBe(404);
  });

  it('deve retornar 400 quando a música já está na playlist', async () => {
    playlistService.addTrackToPlaylist.mockRejectedValue(new Error('Música já está na playlist'));

    const response = await request(app).post('/playlist/1/tracks').send({ trackId: 5 });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /playlist/:id/tracks/:trackId', () => {
  it('deve retornar 401 quando o usuário não está autenticado', async () => {
    isAuthenticated.mockImplementation((req, res) => res.status(401).json({ error: 'Usuário não autenticado' }));

    const response = await request(app).delete('/playlist/1/tracks/5');

    expect(response.status).toBe(401);
  });

  it('deve retornar 200 quando a música é removida com sucesso', async () => {
    playlistService.removeTrackFromPlaylist.mockResolvedValue();

    const response = await request(app).delete('/playlist/1/tracks/5');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Música removida da playlist');
  });
});

describe('DELETE /playlist/:id', () => {
  it('deve retornar 401 quando o usuário não está autenticado', async () => {
    isAuthenticated.mockImplementation((req, res) => res.status(401).json({ error: 'Usuário não autenticado' }));

    const response = await request(app).delete('/playlist/1');

    expect(response.status).toBe(401);
  });

  it('deve retornar 200 quando a playlist é excluída com sucesso', async () => {
    playlistService.deletePlaylist.mockResolvedValue();

    const response = await request(app).delete('/playlist/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Playlist excluída com sucesso');
  });

  it('deve retornar 403 quando o usuário não tem permissão para excluir', async () => {
    playlistService.deletePlaylist.mockRejectedValue(new Error('Sem permissão para editar esta playlist'));

    const response = await request(app).delete('/playlist/1');

    expect(response.status).toBe(403);
  });
});
