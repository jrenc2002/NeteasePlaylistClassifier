// atoms.ts
import { atomWithStorage } from 'jotai/utils';

// 定义背景种类
export type BgKind = 'grid' | 'mini-grid' | 'dot'

export const BgKindAtom = atomWithStorage<BgKind>('bg-kind', 'mini-grid')


// 定义主题类型
export type Theme = 'light' | 'dark'
// 使用本地存储来持久化原子
export const themeAtom = atomWithStorage<Theme>('theme', 'light')



