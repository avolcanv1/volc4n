import { useEffect, useRef } from 'react'
import './DvdFloater.css'

type DvdFloaterProps = {
  active: boolean
  src: string
}

type MotionState = {
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
}

function randomStart(maxX: number, maxY: number) {
  return {
    x: Math.random() * Math.max(0, maxX),
    y: Math.random() * Math.max(0, maxY),
  }
}

function randomVelocity() {
  const speed = 1.25 + Math.random() * 1.75
  const angle = Math.random() * Math.PI * 2

  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  }
}

export function DvdFloater({ active, src }: DvdFloaterProps) {
  const floaterRef = useRef<HTMLDivElement>(null)
  const motionRef = useRef<MotionState | null>(null)

  useEffect(() => {
    const floater = floaterRef.current

    if (!active || !floater) {
      return
    }

    const image = floater.querySelector('img')

    if (!image) {
      return
    }

    let frame = 0

    const startAnimation = () => {
      const { width, height } = floater.getBoundingClientRect()

      if (width === 0 || height === 0) {
        return
      }

      const bounds = () => ({
        maxX: Math.max(0, window.innerWidth - motionRef.current!.width),
        maxY: Math.max(0, window.innerHeight - motionRef.current!.height),
      })

      const start = randomStart(
        Math.max(0, window.innerWidth - width),
        Math.max(0, window.innerHeight - height),
      )
      const velocity = randomVelocity()

      motionRef.current = {
        x: start.x,
        y: start.y,
        vx: velocity.vx,
        vy: velocity.vy,
        width,
        height,
      }

      floater.style.transform = `translate3d(${start.x}px, ${start.y}px, 0)`

      const tick = () => {
        const motion = motionRef.current

        if (!motion) {
          return
        }

        let { x, y, vx, vy } = motion
        x += vx
        y += vy

        const { maxX, maxY } = bounds()

        if (x <= 0) {
          x = 0
          vx = Math.abs(vx)
        } else if (x >= maxX) {
          x = maxX
          vx = -Math.abs(vx)
        }

        if (y <= 0) {
          y = 0
          vy = Math.abs(vy)
        } else if (y >= maxY) {
          y = maxY
          vy = -Math.abs(vy)
        }

        motion.x = x
        motion.y = y
        motion.vx = vx
        motion.vy = vy
        floater.style.transform = `translate3d(${x}px, ${y}px, 0)`
        frame = window.requestAnimationFrame(tick)
      }

      frame = window.requestAnimationFrame(tick)
    }

    if (image.complete) {
      startAnimation()
    } else {
      image.addEventListener('load', startAnimation, { once: true })
    }

    return () => {
      window.cancelAnimationFrame(frame)
      image.removeEventListener('load', startAnimation)
      motionRef.current = null
    }
  }, [active])

  if (!active) {
    return null
  }

  return (
    <div ref={floaterRef} className="dvd-floater" aria-hidden="true">
      <img className="dvd-floater__image" src={src} alt="" draggable={false} />
    </div>
  )
}
