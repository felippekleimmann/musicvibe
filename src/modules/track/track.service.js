export const validateTrackData = ({ title, genreId, artistId, audioUrl }) => { if (!title || title.trim().length < 2) throw new Error('Título da música é obrigatório'); if (!genreId) throw new Error('Gênero é obrigatório'); if (!artistId) throw new Error('Artista é obrigatório'); if (!audioUrl) throw new Error('Arquivo de áudio é obrigatório'); return true; };
export const canManageTracks = (user) => user?.role === 'admin';
export const incrementPlayCount = (track) => ({ ...track, playCount: (track.playCount || 0) + 1 });
export const filterActiveTracks = (tracks) => tracks.filter((track) => track.active !== false);
