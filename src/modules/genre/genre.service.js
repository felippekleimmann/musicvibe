export const validateGenreData = ({ name }) => { if (!name || name.trim().length < 3) throw new Error('Gênero deve ter no mínimo 3 caracteres'); return true; };
export const canManageGenres = (user) => user?.role === 'admin';
export const filterActiveGenres = (genres) => genres.filter((genre) => genre.active !== false);
