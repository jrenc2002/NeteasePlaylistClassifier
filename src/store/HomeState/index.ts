import { atomWithStorage } from 'jotai/utils';

// 定义类型
export interface Song {
  name: string
  id: number
  ar: Array<{
    id: number
    name: string
  }>
  al: {
    id: number
    name: string
    picUrl: string
  }
}

export interface MusicInfo {
  songId: number
  songName: string
  style?: string[]
  tags?: string[]
  language?: string
  bpm?: number
}

export interface AnalyzeProgress {
  current: number
  total: number
  currentSong: string
}

export interface FilterOptions {
  styles: string[]
  tags: string[]
  languages: string[]
  bpmRange: {
    min: number
    max: number
  } | null
}

// 创建原子状态
export const playlistIdAtom = atomWithStorage<string>('playlist-id', '')
export const songsAtom = atomWithStorage<Song[]>('songs', [])
export const musicInfosAtom = atomWithStorage<MusicInfo[]>('music-infos', [])
export const filterOptionsAtom = atomWithStorage<FilterOptions>('filter-options', {
  styles: [],
  tags: [],
  languages: [],
  bpmRange: null
})
export const bpmDisplayValuesAtom = atomWithStorage<{min: number, max: number}>('bpm-display-values', {
  min: 0,
  max: 0
})

// 这些状态不需要持久化存储
export const loadingAtom = atomWithStorage<boolean>('loading', false)
export const errorAtom = atomWithStorage<string>('error', '')
export const analyzingAtom = atomWithStorage<boolean>('analyzing', false)
export const progressAtom = atomWithStorage<AnalyzeProgress>('progress', {
  current: 0,
  total: 0,
  currentSong: ''
}) 