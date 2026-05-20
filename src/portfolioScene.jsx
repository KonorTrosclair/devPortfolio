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
function NeonText({ children, position, color, fontSize = 1, font, isVisible }) {
  const matRef = useRef()
  useFrame(({ clock }) => {
    if (!matRef.current || !isVisible) return
    const t = clock.getElapsedTime()
    const flicker =
      Math.sin(t * 3)   * 0.3 +
      Math.sin(t * 5)   * 0.2 +
      Math.sin(t * 1.5) * 0.1 +
      (Math.random() < 0.02 ? Math.random() * 0.4 : 0)
    matRef.current.emissiveIntensity = Math.max(0.5, 2.5 + flicker * 2.5)
  })
  return (
    <Text position={position} fontSize={fontSize} anchorX="center" anchorY="middle" font={font}>
      {children}
      <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
    </Text>
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