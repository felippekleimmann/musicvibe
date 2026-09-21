import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import nock from 'nock';
import {
  searchTracks,
  getTopTrack,
  ITUNES_BASE_URL,
} from '../externalMusic.service.js';

describe('externalMusic.service — Testes de API com nock', () => {

  beforeAll(() => nock.disableNetConnect());

  afterEach(() => nock.cleanAll());

  afterAll(() => nock.enableNetConnect());

  it('1 - deve buscar faixas na API do iTunes e retornar a lista mapeada', async () => {
    nock(ITUNES_BASE_URL)
      .get('/search')
      .query(true)
      .reply(200, {
        resultCount: 1,
        results: [
          {
            trackName: 'Bohemian Rhapsody',
            artistName: 'Queen',
            collectionName: 'A Night at the Opera',
            previewUrl: 'https://audio.itunes.com/preview.m4a',
          },
        ],
      });

    const tracks = await searchTracks('Queen');

    expect(tracks).toHaveLength(1);
    expect(tracks[0]).toHaveProperty('title', 'Bohemian Rhapsody');
    expect(tracks[0]).toHaveProperty('artist', 'Queen');
  });

  it('2 - deve mapear corretamente os campos retornados pela API externa', async () => {
    nock(ITUNES_BASE_URL)
      .get('/search')
      .query(true)
      .reply(200, {
        resultCount: 1,
        results: [
          {
            trackName: 'Imagine',
            artistName: 'John Lennon',
            collectionName: 'Imagine',
            previewUrl: 'https://audio.itunes.com/imagine.m4a',
          },
        ],
      });

    const [track] = await searchTracks('Imagine');

    expect(track).toEqual({
      title: 'Imagine',
      artist: 'John Lennon',
      album: 'Imagine',
      previewUrl: 'https://audio.itunes.com/imagine.m4a',
    });
  });

  it('3 - deve enviar o termo de busca como parâmetro na requisição à API', async () => {
    const scope = nock(ITUNES_BASE_URL)
      .get('/search')
      .query((q) => q.term === 'Beatles' && q.media === 'music')
      .reply(200, { resultCount: 0, results: [] });

    await searchTracks('Beatles');

    expect(scope.isDone()).toBe(true);
  });

  it('4 - deve lançar erro quando o termo de busca é vazio (sem chamar a API)', async () => {
    await expect(searchTracks('')).rejects.toThrow('Termo de busca é obrigatório');
  });

  it('5 - getTopTrack deve retornar a primeira faixa retornada pela API', async () => {
    nock(ITUNES_BASE_URL)
      .get('/search')
      .query(true)
      .reply(200, {
        resultCount: 2,
        results: [
          { trackName: 'Hey Jude', artistName: 'The Beatles', collectionName: 'Hey Jude', previewUrl: 'a.m4a' },
          { trackName: 'Let It Be', artistName: 'The Beatles', collectionName: 'Let It Be', previewUrl: 'b.m4a' },
        ],
      });

    const top = await getTopTrack('Beatles');

    expect(top.title).toBe('Hey Jude');
  });

  it('6 - getTopTrack deve lançar erro quando a API não retorna resultados', async () => {
    nock(ITUNES_BASE_URL)
      .get('/search')
      .query(true)
      .reply(200, { resultCount: 0, results: [] });

    await expect(getTopTrack('asdkjhasd')).rejects.toThrow(
      'Nenhuma faixa encontrada para o termo informado'
    );
  });

  it('7 - deve propagar o erro quando a API externa responde com falha (500)', async () => {
    nock(ITUNES_BASE_URL)
      .get('/search')
      .query(true)
      .reply(500, { error: 'Internal Server Error' });

    await expect(searchTracks('Queen')).rejects.toThrow();
  });
});
