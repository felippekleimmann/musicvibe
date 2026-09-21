import axios from 'axios';

export const ITUNES_BASE_URL = 'https://itunes.apple.com';

export const searchTracks = async (term) => {
  if (!term || term.trim() === '') {
    throw new Error('Termo de busca é obrigatório');
  }

  const { data } = await axios.get(`${ITUNES_BASE_URL}/search`, {
    params: { term, media: 'music', limit: 5 },
  });

  return data.results.map((track) => ({
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName,
    previewUrl: track.previewUrl,
  }));
};

export const getTopTrack = async (term) => {
  const tracks = await searchTracks(term);

  if (tracks.length === 0) {
    throw new Error('Nenhuma faixa encontrada para o termo informado');
  }

  return tracks[0];
};
