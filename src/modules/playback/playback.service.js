export const validatePlayback = ({ userId, trackId }) => { if (!userId) throw new Error('Usuário é obrigatório'); if (!trackId) throw new Error('Música é obrigatória'); return true; };
export const validateProgress = (progressSeconds, duration) => { if (progressSeconds < 0) throw new Error('Progresso inválido'); if (duration && progressSeconds > duration) throw new Error('Progresso não pode ser maior que a duração'); return true; };
export const isTrackFinished = (progressSeconds, duration) => duration > 0 && progressSeconds >= duration;
