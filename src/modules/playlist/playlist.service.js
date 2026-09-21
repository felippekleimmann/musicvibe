import { Playlist } from '../../models/Playlist.js';
import { PlaylistTrack } from '../../models/PlaylistTrack.js';
import { Track } from '../../models/Track.js';

export const validatePlaylistData = ({ name, userId }) => {
  if (!name || name.trim().length < 3) throw new Error('Nome da playlist é obrigatório');
  if (!userId) throw new Error('Usuário é obrigatório');
  return true;
};

export const canEditPlaylist = (user, playlist) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.id === playlist?.UserId || user.id === playlist?.userId;
};

export const canViewPlaylist = (user, playlist) =>
  playlist?.visibility === 'public' || canEditPlaylist(user, playlist);

export const canAddTrackToPlaylist = (user, playlist) => canEditPlaylist(user, playlist);

export const createPlaylist = async ({ name, description, visibility, userId }) => {
  validatePlaylistData({ name, userId });

  return Playlist.create({
    name,
    description,
    visibility: visibility || 'private',
    UserId: userId,
  });
};

export const getPlaylistById = async (id) => {
  if (!id) throw new Error('ID é obrigatório');
  return Playlist.findByPk(id, { include: Track });
};

export const listPlaylistsByUser = async (userId) => {
  if (!userId) throw new Error('Usuário é obrigatório');
  return Playlist.findAll({ where: { UserId: userId } });
};

export const listPublicPlaylists = async () => {
  return Playlist.findAll({ where: { visibility: 'public' } });
};

export const addTrackToPlaylist = async (user, playlistId, trackId) => {
  const playlist = await Playlist.findByPk(playlistId);
  if (!playlist) throw new Error('Playlist não encontrada');

  if (!canAddTrackToPlaylist(user, playlist)) throw new Error('Sem permissão para editar esta playlist');

  const track = await Track.findByPk(trackId);
  if (!track) throw new Error('Música não encontrada');

  const existing = await PlaylistTrack.findOne({ where: { PlaylistId: playlistId, TrackId: trackId } });
  if (existing) throw new Error('Música já está na playlist');

  return PlaylistTrack.create({ PlaylistId: playlistId, TrackId: trackId });
};

export const removeTrackFromPlaylist = async (user, playlistId, trackId) => {
  const playlist = await Playlist.findByPk(playlistId);
  if (!playlist) throw new Error('Playlist não encontrada');

  if (!canEditPlaylist(user, playlist)) throw new Error('Sem permissão para editar esta playlist');

  const playlistTrack = await PlaylistTrack.findOne({ where: { PlaylistId: playlistId, TrackId: trackId } });
  if (!playlistTrack) throw new Error('Música não está na playlist');

  return playlistTrack.destroy();
};

export const deletePlaylist = async (user, playlistId) => {
  const playlist = await Playlist.findByPk(playlistId);
  if (!playlist) throw new Error('Playlist não encontrada');

  if (!canEditPlaylist(user, playlist)) throw new Error('Sem permissão para editar esta playlist');

  return playlist.destroy();
};
