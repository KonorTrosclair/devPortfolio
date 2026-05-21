import { useTexture } from '@react-three/drei'
import { Text } from '@react-three/drei'
import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// ── Constants ──────────────────────────────────────────────────────────────────
const base = import.meta.env.BASE_URL

const HOVER_COLOR = '#f50000'
const BASE_COLOR = '#009bf5'

let text_c = BASE_COLOR
let back_c = BASE_COLOR

// These MUST match your texture repeat exactly (8, 4)
const COLS         = 60
const ROWS         = 32
const WALL_W       = 32
const WALL_H       = 16
const TILE_W       = (WALL_W) / COLS   // 7.5 units — one texture tile wide
const TILE_H       = (WALL_H) / ROWS   // 8.0 units — one texture tile tall
const BRICK_D      = 0.6
const BREAK_RADIUS = 10              // in world units — tune this to taste
const RIPPLE_SPEED = 3.5             // units/sec outward ripple

export function ProfileImage() {
  return (
    //  <div style={{
    //   boxShadow: '0 0 8px #009bf5, 0 0 20px #009bf522',
    //   display: 'inline-flex',
    //   borderRadius: '8px',
    //   width: '200px',
    //   height: '200px',
    // }}>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 482.9 482.9" style={{ enableBackground: 'new 0 0 482.9 482.9' }} xmlSpace="preserve" height="100%"
                fill="none"
                stroke="#009bf5"
                strokeWidth="4"
                filter="url(#glow)"
              >
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4"  floodColor="#009bf5" floodOpacity="1" />
                    <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#009bf5" floodOpacity="0.5" />
                  </filter>
                </defs>
                <g>
                  <path d="M239.7,260.2c0.5,0,1,0,1.6,0c0.2,0,0.4,0,0.6,0c0.3,0,0.7,0,1,0c29.3-0.5,53-10.8,70.5-30.5
                    c38.5-43.4,32.1-117.8,31.4-124.9c-2.5-53.3-27.7-78.8-48.5-90.7C280.8,5.2,262.7,0.4,242.5,0h-0.7c-0.1,0-0.3,0-0.4,0h-0.6
                    c-11.1,0-32.9,1.8-53.8,13.7c-21,11.9-46.6,37.4-49.1,91.1c-0.7,7.1-7.1,81.5,31.4,124.9C186.7,249.4,210.4,259.7,239.7,260.2z
                    M164.6,107.3c0-0.3,0.1-0.6,0.1-0.8c3.3-71.7,54.2-79.4,76-79.4h0.4c0.2,0,0.5,0,0.8,0c27,0.6,72.9,11.6,76,79.4
                    c0,0.3,0,0.6,0.1,0.8c0.1,0.7,7.1,68.7-24.7,104.5c-12.6,14.2-29.4,21.2-51.5,21.4c-0.2,0-0.3,0-0.5,0l0,0c-0.2,0-0.3,0-0.5,0
                    c-22-0.2-38.9-7.2-51.4-21.4C157.7,176.2,164.5,107.9,164.6,107.3z" />
                  <path d="M446.8,383.6c0-0.1,0-0.2,0-0.3c0-0.8-0.1-1.6-0.1-2.5c-0.6-19.8-1.9-66.1-45.3-80.9c-0.3-0.1-0.7-0.2-1-0.3
                    c-45.1-11.5-82.6-37.5-83-37.8c-6.1-4.3-14.5-2.8-18.8,3.3c-4.3,6.1-2.8,14.5,3.3,18.8c1.7,1.2,41.5,28.9,91.3,41.7
                    c23.3,8.3,25.9,33.2,26.6,56c0,0.9,0,1.7,0.1,2.5c0.1,9-0.5,22.9-2.1,30.9c-16.2,9.2-79.7,41-176.3,41
                    c-96.2,0-160.1-31.9-176.4-41.1c-1.6-8-2.3-21.9-2.1-30.9c0-0.8,0.1-1.6,0.1-2.5c0.7-22.8,3.3-47.7,26.6-56
                    c49.8-12.8,89.6-40.6,91.3-41.7c6.1-4.3,7.6-12.7,3.3-18.8c-4.3-6.1-12.7-7.6-18.8-3.3c-0.4,0.3-37.7,26.3-83,37.8
                    c-0.4,0.1-0.7,0.2-1,0.3c-43.4,14.9-44.7,61.2-45.3,80.9c0,0.9,0,1.7-0.1,2.5c0,0.1,0,0.2,0,0.3c-0.1,5.2-0.2,31.9,5.1,45.3
                    c1,2.6,2.8,4.8,5.2,6.3c3,2,74.9,47.8,195.2,47.8s192.2-45.9,195.2-47.8c2.3-1.5,4.2-3.7,5.2-6.3
                    C447,415.5,446.9,388.8,446.8,383.6z" />
                </g>
              </svg>
            // </div>
  )
}

export function StackIcon({ src, label, background }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      border: '2px solid #009bf5',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 0 8px #009bf5, 0 0 20px #009bf522',
    }}>
      <div style={{background: background || 'transparent', borderRadius: '8px', padding: background ? '8px' : '0', display: 'inline-flex'}}>
        <img class="stack-icon" src={src} />
      </div>
      <span style={{color: 'white', fontFamily: 'sans-serif', fontSize: '12px', letterSpacing: '0.1em'}}>{label}</span>
    </div>
  )
}


// ── Neon text (unchanged) ──────────────────────────────────────────────────────
export function NeonTitleText({ children, color = '#009bf5', fontSize = '2rem', className}) {
  const ref = useRef()

  useEffect(() => {
    let animFrame
    const animate = () => {
      if (!ref.current) return
      const t = performance.now() / 1000
      const flicker =
        Math.sin(t * 3)   * 0.3 +
        Math.sin(t * 5)   * 0.2 +
        Math.sin(t * 1.5) * 0.1 +
        (Math.random() < 0.02 ? Math.random() * 0.4 : 0)
      const intensity = Math.max(0.5, 2.5 + flicker * 2.5)
      const glow = intensity * 10
      ref.current.style.textShadow = `
        0 0 ${glow}px ${color},
        0 0 ${glow * 2}px ${color},
        0 0 ${glow * 3}px ${color}
      `
      animFrame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animFrame)
  }, [color])

  return (
    <span ref={ref} className={className} style={{
      color: color,
      fontSize: fontSize,
      fontFamily: 'neon',  // ← matches @font-face name
      letterSpacing: '0.2em',
      textShadow: `0 0 20px ${color}`,
    }}>
      {children}
    </span>
  )
}

// ── Static background wall (your original, unchanged) ─────────────────────────
function BrickWall() {
 

    const [color, normal, roughness] = useTexture([
        `${base}assets/Bricks058_4K-JPG_Color.jpg`,
        `${base}assets/Bricks058_4K-JPG_NormalGL.jpg`,
        `${base}assets/Bricks058_4K-JPG_Roughness.jpg`,
    ])
  ;[color, normal, roughness].forEach(t => {
    t.repeat.set(8, 4)
    t.wrapS = t.wrapT = 1000
  })
  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[60, 32]} />
      <meshStandardMaterial map={color} normalMap={normal} normalScale={[2, 2]} roughnessMap={roughness} roughness={1} />
    </mesh>
  )
}

// ── Main scene ─────────────────────────────────────────────────────────────────
export default function PortfolioScene({ isVisible }) {
    const lightRefTop = useRef()
    const lightRefBottom = useRef()
  // Load textures once — passed down to both BrickWall and BreakableGrid
//   const [colorMap, normalMap, roughMap] = useTexture([
//     '/src/assets/Bricks058_4K-JPG_Color.jpg',
//     '/src/assets/Bricks058_4K-JPG_NormalGL.jpg',
//     '/src/assets/Bricks058_4K-JPG_Roughness.jpg',
//   ])

    const mouseRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
    const handleMouseMove = (e) => {
        // convert pixel coords to -1 to 1
        mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
        mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame(() => {
    if (!lightRefTop.current || !lightRefBottom.current || !isVisible) return
        lightRefTop.current.position.x = mouseRef.current.x * 16
        lightRefTop.current.position.y = mouseRef.current.y * 8
        lightRefBottom.current.position.x = mouseRef.current.x * 16
        lightRefBottom.current.position.y = mouseRef.current.y * 8
    })
  


  // const c = buttonHovered ? HOVER_COLOR : BASE_COLOR

  return (
      <>
      <ambientLight intensity={0.02} />



    <pointLight ref={lightRefTop} position={[0, 0, 2]} color={BASE_COLOR} intensity={20} distance={20} />
    <pointLight ref={lightRefBottom} position={[0, 0, -2.2]} color={BASE_COLOR} intensity={20} distance={20} />
    
      
    

      {/* Background wall — always visible, bricks sit in front of it */}
      <BrickWall />


      
    </>
  )
}