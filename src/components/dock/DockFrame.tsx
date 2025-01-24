import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence
} from 'framer-motion'
import React, { PropsWithChildren, useRef, useState } from 'react'

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string
  magnification?: number
  distance?: number
  children: React.ReactNode
}

const DEFAULT_MAGNIFICATION = 60
const DEFAULT_DISTANCE = 140

const dockVariants = cva(
  'mx-auto flex h-[58px] w-max items-end gap-2 rounded-2xl border p-2 dark:border-[#707070]'
)

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      magnification = DEFAULT_MAGNIFICATION,
      distance = DEFAULT_DISTANCE,
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(Infinity)

    const renderChildren = () => {
      return React.Children.map(children, (child: any) => {
        return React.cloneElement(child, {
          mouseX: mouseX,
          magnification: magnification,
          distance: distance
        })
      })
    }

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(dockVariants({ className }), className)}
      >
        {renderChildren()}
      </motion.div>
    )
  }
)

Dock.displayName = 'Dock'

export interface DockIconProps {
  size?: number
  magnification?: number
  distance?: number
  mouseX?: any
  className?: string
  children?: React.ReactNode
  onClick?: () => void
  props?: PropsWithChildren
  name?: string
  designation?: string
  id?: number | null // 修改 id 类型
}

const DockIcon = ({
  id,
  size,
  name,
  designation,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  onClick,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [40, magnification, 40]
  )

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  })

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const springConfig = { stiffness: 300, damping: 20 }
  const translateX = useSpring(
    useTransform(distanceCalc, [-distance, distance], [-20, 20]),
    springConfig
  )

  const rotate = useSpring(
    useTransform(distanceCalc, [-distance, distance], [-15, 15]),
    springConfig
  )

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        'flex aspect-square cursor-pointer items-center justify-center rounded-full relative group',
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setHoveredIndex(id ?? null)} // 确保 id 不为 undefined
      onMouseLeave={() => setHoveredIndex(null)}
      {...props}
    >
      <AnimatePresence mode="popLayout">
        {hoveredIndex === id && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 260,
                damping: 10
              }
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              translateX: translateX,
              rotate: rotate,
              whiteSpace: 'nowrap'
            }}
            className="absolute -left-1/2 -top-16 z-50 flex translate-x-1/2 flex-col items-center justify-center rounded-md bg-gray-50 px-4 py-2 text-xs"
          >
            <div className="absolute inset-x-10 -bottom-px z-30 h-px w-1/5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent " />
            <div className="absolute -bottom-px left-10 z-30 h-px w-2/5 bg-gradient-to-r from-transparent via-sky-500 to-transparent " />
            <div className="relative z-30 text-base font-bold text-blacks">
              {name}
            </div>
            <div className="text-xs text-black">{designation}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </motion.div>
  )
}

DockIcon.displayName = 'DockIcon'

export { Dock, DockIcon, dockVariants }
