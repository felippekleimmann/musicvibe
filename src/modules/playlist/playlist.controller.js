import * as playlistService from './playlist.service.js';

// Traduz mensagens de erro lançadas pelo Service em status HTTP apropriados.
const mapErrorToStatus = (message = '') => {
  if (message.includes('não encontrada') || message.includes('não encontrado')) return 404;
  if (message.includes('permissão')) return 403;
  if (message) return 400;
  return 500;
};

export const listPublic = async (req, res) => {
  try {
    const playlists = await playlistService.listPublicPlaylists();
    return res.json(playlists);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const listMine = async (req, res) => {
  try {
    const playlists = await playlistService.listPlaylistsByUser(req.session.user.id);
    return res.json(playlists);
  } catch (error) {
    return res.status(mapErrorToStatus(error.message)).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    const playlist = await playlistService.createPlaylist({
      name,
      description,
      visibility,
      userId: req.session.user.id,
    });
    return res.status(201).json({ message: 'Playlist criada com sucesso', playlist });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const playlist = await playlistService.getPlaylistById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist não encontrada' });
    }

    const canView = playlistService.canViewPlaylist(req.session?.user, playlist);
    if (!canView) {
      return res.status(403).json({ error: 'Sem permissão para visualizar esta playlist' });
    }

    return res.json(playlist);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addTrack = async (req, res) => {
  try {
    const { trackId } = req.body;
    const playlistTrack = await playlistService.addTrackToPlaylist(req.session.user, req.params.id, trackId);
    return res.status(201).json({ message: 'Música adicionada à playlist', playlistTrack });
  } catch (error) {
    return res.status(mapErrorToStatus(error.message)).json({ error: error.message });
  }
};

export const removeTrack = async (req, res) => {
  try {
    await playlistService.removeTrackFromPlaylist(req.session.user, req.params.id, req.params.trackId);
    return res.json({ message: 'Música removida da playlist' });
  } catch (error) {
    return res.status(mapErrorToStatus(error.message)).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await playlistService.deletePlaylist(req.session.user, req.params.id);
    return res.json({ message: 'Playlist excluída com sucesso' });
  } catch (error) {
    return res.status(mapErrorToStatus(error.message)).json({ error: error.message });
  }
};
