export const validateArtistData = ({ name }) => { if (!name || name.trim().length < 2) throw new Error('Nome do artista é obrigatório'); return true; };
export const canManageArtists = (user) => user?.role === 'admin';
export const filterActiveArtists = (artists) => artists.filter((artist) => artist.active !== false);
