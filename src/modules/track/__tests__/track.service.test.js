import { describe, it, expect } from 'vitest';
import { validateTrackData, canManageTracks, incrementPlayCount, filterActiveTracks } from '../track.service.js';
import { Track } from '../../../models/Track.js';
describe('Track Service', () => { it('deve validar música', () => expect(validateTrackData({ title:'Song', genreId:1, artistId:1, audioUrl:'/song.mp3' })).toBe(true)); it('deve exigir áudio', () => expect(() => validateTrackData({ title:'Song', genreId:1, artistId:1 })).toThrow('Arquivo')); it('deve incrementar plays', () => expect(incrementPlayCount({ playCount:2 }).playCount).toBe(3)); it('deve filtrar ativas', () => expect(filterActiveTracks([{active:true},{active:false}])).toHaveLength(1)); it('deve permitir admin', () => expect(canManageTracks({role:'admin'})).toBe(true)); });
describe('Track Model', () => { it('deve possuir campos principais', () => { expect(Track.rawAttributes.title).toBeDefined(); expect(Track.rawAttributes.audioUrl).toBeDefined(); }); });
