// src/components/magicui/GridBg.tsx
import React from 'react'
import { BgKindAtom } from '@/store/AppSet'
import { useAtom } from 'jotai'
interface GridBgProps {
  children?: React.ReactNode
}

export const GridBg: React.FC<GridBgProps> = ({ children }) => {
  let bgClass = ''
  const [bgKind] = useAtom(BgKindAtom)

  switch (bgKind) {
    case 'grid':
      bgClass = ' dark:bg-grid-white/[0.2] bg-grid-black/[0.2]'
      break
    case 'mini-grid':
      bgClass = 'dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.3] '
      break
    case 'dot':
      bgClass = 'dark:bg-dot-white/[0.2] bg-dot-black/[0.4] '
      break
    default:
      bgClass = 'dark:bg-grid-white/[0.2] bg-grid-black/[0.2]'
      break
  }

  return (
    <div
      className={`relative h-full w-full bg-white dark:bg-black ${bgClass} relative flex items-center justify-center`}
    >
      {/* Radial gradient for the container to give a faded look */}
      {/*<div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_100%,black)]"></div>*/}
      {children}
    </div>
  )
}
