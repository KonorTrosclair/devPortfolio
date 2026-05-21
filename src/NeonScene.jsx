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



// ── Flicker light (unchanged) ──────────────────────────────────────────────────
function FlickerLight({ position, color, baseIntensity = 20, distance = 25, isVisible}) {
  const lightRef = useRef()
  useFrame(({ clock }) => {
    if (!isVisible) return   
    const t = clock.getElapsedTime()
    const flicker =
      Math.sin(t * 3)   * 0.3 +
      Math.sin(t * 5)   * 0.2 +
      Math.sin(t * 1.5) * 0.1 +
      (Math.random() < 0.05 ? Math.random() * 0.4 : 0)
    lightRef.current.intensity = Math.max(0, baseIntensity + flicker * baseIntensity)
  })
  return <pointLight ref={lightRef} position={position} color={color} intensity={baseIntensity} distance={distance} />
}

function OvalLights({ color, isVisible, centerY = 1, radiusX = 8, radiusY = 3, count = 16 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.cos(angle) * radiusX
        const y = centerY + Math.sin(angle) * radiusY
        return (
          <FlickerLight
            key={`oval${i}`}
            position={[x, y, -2.5]}
            color={color}
            baseIntensity={5}
            distance={8}
            isVisible={isVisible}
          />
        )
      })}
    </>
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

function NeonButton({ label, position, color, onClick, onHover }) {
  const [hovered, setHovered] = useState(false)

  const hoverBoxShadow = `0 0 20px ${color}, 0 0 40px ${color}, inset 0 0 20px ${color}22`
  const nonHoverBoxShadow = `0 0 8px ${color}, 0 0 20px ${color}, inset 0 0 8px ${color}22`

  return (
    <Html center position={position}>
      <button
        onClick={onClick}
        onMouseEnter={() => {setHovered(true); onHover(true)}}
        onMouseLeave={() => {setHovered(false); onHover(false)}}
        style={{
          background: 'transparent',
          border: `2px solid ${color}`,
          color: color,
          fontFamily: 'sans-serif',
          fontSize: '1rem',
          letterSpacing: '0.3em',
          padding: '12px 40px',
          cursor: 'pointer',
          textShadow: `0 0 8px ${color}, 0 0 20px ${color}`,
          boxShadow: hovered ? hoverBoxShadow : nonHoverBoxShadow,
          animation: 'neonFlicker 4s infinite',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </button>
    </Html>
  )
}

// ── Main scene ─────────────────────────────────────────────────────────────────
export default function NeonScene({ onEnter, isVisible }) {
  // Load textures once — passed down to both BrickWall and BreakableGrid
  // const [color, normal, roughness] = useTexture([
  //   '/src/assets/Bricks058_4K-JPG_Color.jpg',
  //   '/src/assets/Bricks058_4K-JPG_NormalGL.jpg',
  //   '/src/assets/Bricks058_4K-JPG_Roughness.jpg',
  // ])

  const [buttonHovered, setButtonHovered] = useState(false)
  const colorTextRef = useRef(new THREE.Color(BASE_COLOR))
  const colorBackRef = useRef(new THREE.Color(BASE_COLOR))
  const [c, setC] = useState(BASE_COLOR)

  useEffect(() => {
    if (!isVisible) {
      // reset color state so it's fresh when canvas resumes
      colorTextRef.current.set(BASE_COLOR)
      colorBackRef.current.set(BASE_COLOR)
      setC(BASE_COLOR)
    }
  }, [isVisible])

  useFrame((_, delta) => {
    if (!isVisible) return 
    const target = new THREE.Color(buttonHovered ? HOVER_COLOR : BASE_COLOR)
    colorTextRef.current.lerp(target, delta * 4)  
    colorBackRef.current.lerp(target, delta * 2)
    setC('#' + colorTextRef.current.getHexString())
  })

  // const c = buttonHovered ? HOVER_COLOR : BASE_COLOR

  return (
      <>
      <ambientLight intensity={0.02} />
      {/* <pointLight position={[0,    2.5, -2.2]} color={c} intensity={20} distance={20} />
      <pointLight position={[3,    2.5, -2.2]} color={c} intensity={15} distance={20} />
      <pointLight position={[-3,   2.5, -2.2]} color={c} intensity={15} distance={20} />
      <pointLight position={[6.5,  2.5, -2.2]} color={c} intensity={5} distance={20} />
      <pointLight position={[-6.5, 2.5, -2.2]} color={c} intensity={5} distance={20} />
      <pointLight position={[10.5,  2.5, -2.2]} color={c} intensity={5} distance={20} />
      <pointLight position={[-10.5, 2.5, -2.2]} color={c} intensity={5} distance={20} />
      <pointLight position={[14.5,  2.5, -2.2]} color={c} intensity={5} distance={20} />
      <pointLight position={[-14.5, 2.5, -2.2]} color={c} intensity={5} distance={20} /> */}
      {/* <pointLight position={[7,    2.5, -2.5]} color={c} intensity={10} distance={3}  />
      <pointLight position={[-7,   2.5, -2.5]} color={c} intensity={10} distance={3}  /> */}
      <FlickerLight position={[0, 6.5, 5.5]} color={c} baseIntensity={10} distance={3} isVisible={isVisible}/>

      {/* {Array.from({ length: 8 }, (_, i) => (
        <FlickerLight key={`l${i}`} position={[-19, -10 + i * 2.5, -2.5]} color={c} baseIntensity={5} distance={25} isVisible={isVisible}/>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <FlickerLight key={`r${i}`} position={[19, -10 + i * 2.5, -2.5]} color={c} baseIntensity={5} distance={25} isVisible={isVisible}/>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <FlickerLight key={`t${i}`} position={[-15 + i * 2.5, 13, -2.0]} color={c} baseIntensity={5} distance={25} isVisible={isVisible}/>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <FlickerLight key={`b${i}`} position={[-15 + i * 2.5, -13, -2.5]} color={c} baseIntensity={5} distance={25} isVisible={isVisible}/>
      ))} */}

      {/* Background wall — always visible, bricks sit in front of it */}
      <BrickWall />

      
      <OvalLights color={c} isVisible={isVisible} centerY={1} radiusX={14} radiusY={5} count={20} />

      {/* Neon sign */}
        <NeonText font={`${base}fonts/neon2.ttf`} position={[0, 2, -2]} color={c} fontSize={2.0} isVisible={isVisible}>
          KONOR TROSCLAIR
        </NeonText>

        <NeonText font={`${base}fonts/neon2.ttf`} position={[0, 0, -2]} color={c} fontSize={1} isVisible={isVisible}>
          Software Engineer
        </NeonText>


      <NeonButton label="View My Work ↓" 
                  position={[0, -2, -2]} 
                  color={c} 
                  onClick={onEnter} 
                  onHover={setButtonHovered} />
    </>
  )
}