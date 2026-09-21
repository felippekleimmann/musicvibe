export const validateAlbumData = ({ title, artistId }) => { if (!title || title.trim().length < 2) throw new Error('Título do álbum é obrigatório'); if (!artistId) throw new Error('Artista é obrigatório'); return true; };
export const canManageAlbums = (user) => user?.role === 'admin';
