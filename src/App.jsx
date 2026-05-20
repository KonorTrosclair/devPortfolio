import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense } from 'react'
import NeonScene from './NeonScene'
import PortfolioScene, { StackIcon } from './portfolioScene'


export default function App() {
  const homeRef = useRef()
  const portfolioRef = useRef()
  const [homeVisible, setHomeVisible] = useState(true)
  const [portfolioVisible, setPortfolioVisible] = useState(false)

  // const goToPortfolio = () => {
  //   document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' })
  // }

  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const homeObserver = new IntersectionObserver(
      ([entry]) => setHomeVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    const portfolioObserver = new IntersectionObserver(
      ([entry]) => setPortfolioVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (homeRef.current) homeObserver.observe(homeRef.current)
    if (portfolioRef.current) portfolioObserver.observe(portfolioRef.current)
    return () => {
      homeObserver.disconnect()
      portfolioObserver.disconnect()
    }
  }, [])

  return (
    <div style={{ overflowY: 'scroll', overflowX: 'hidden', height: '100vh' }}>

      <div ref={homeRef} id="home" style={{ width: '100vw', height: '100vh' }}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 90 }}
          frameloop={homeVisible ? 'always' : 'never'}
        >

            <NeonScene onEnter={() => scrollTo('about')} isVisible={homeVisible} />

          <EffectComposer>
            <Bloom intensity={1.4} luminanceThreshold={0.2} luminanceSmoothing={0.7} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>

      <div ref={portfolioRef} id="portfolio" style={{ width: '100vw', height: '400vh', background: 'transparent', position: 'relative' }}>
  
        {/* Sticky canvas behind content */}
        <Canvas
          camera={{ position: [0, 0, 8], fov: 90 }}
          frameloop={portfolioVisible ? 'always' : 'never'}
          style={{ position: 'sticky', top: 0, height: '100vh' }}
        >
          <PortfolioScene isVisible={portfolioVisible} />
          <EffectComposer>
            <Bloom intensity={1.4} luminanceThreshold={0.2} luminanceSmoothing={0.7} mipmapBlur />
          </EffectComposer>
        </Canvas>

        {/* Content scrolls over the canvas */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', color: 'white' }}>

        
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '32px',
          padding: '16px 40px',
          boxSizing: 'border-box',
          background: 'transparent',
        }}>
          <a 
            onClick={() => scrollTo('home')} 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontFamily: 'sans-serif', 
              letterSpacing: '0.2em',
              cursor: 'pointer',
              pointerEvents: 'auto'   // ← override parent's pointerEvents: none
            }}
          >
            HOME
          </a>
          <a 
            onClick={() => scrollTo('about')} 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontFamily: 'sans-serif', 
              letterSpacing: '0.2em',
              cursor: 'pointer',
              pointerEvents: 'auto'   // ← override parent's pointerEvents: none
            }}
          >
            ABOUT
          </a>

          <a 
            onClick={() => scrollTo('stack')} 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontFamily: 'sans-serif', 
              letterSpacing: '0.2em',
              cursor: 'pointer',
              pointerEvents: 'auto'   // ← override parent's pointerEvents: none
            }}
          >
            STACK
          </a>

          <a 
            onClick={() => scrollTo('projects')} 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontFamily: 'sans-serif', 
              letterSpacing: '0.2em',
              cursor: 'pointer',
              pointerEvents: 'auto'   // ← override parent's pointerEvents: none
            }}
          >
            PROJECTS
          </a>

          <a 
            onClick={() => scrollTo('contact')} 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontFamily: 'sans-serif', 
              letterSpacing: '0.2em',
              cursor: 'pointer',
              pointerEvents: 'auto'   // ← override parent's pointerEvents: none
            }}
          >
            CONTACT
          </a>
        </div>

        <div id="about" style={{ height: '100vh', paddingTop: '80px'}}>
          <div id="about-title">
            <h1 class="title" >About</h1>
          </div>
          
          <div id="about-svg" style={{height: '30vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              x="0px" y="0px" viewBox="0 0 482.9 482.9" style={{ enableBackground: 'new 0 0 482.9 482.9' }} xml:space="preserve" height="100%" 
              stroke="rgb(26, 26, 26)" stroke-width="16"><g><path fill="url(#gradient-1)" 
              d="M239.7,260.2c0.5,0,1,0,1.6,0c0.2,0,0.4,0,0.6,0c0.3,0,0.7,0,1,0c29.3-0.5,53-10.8,70.5-30.5
              c38.5-43.4,32.1-117.8,31.4-124.9c-2.5-53.3-27.7-78.8-48.5-90.7C280.8,5.2,262.7,0.4,242.5,0h-0.7c-0.1,0-0.3,0-0.4,0h-0.6
              c-11.1,0-32.9,1.8-53.8,13.7c-21,11.9-46.6,37.4-49.1,91.1c-0.7,7.1-7.1,81.5,31.4,124.9C186.7,249.4,210.4,259.7,239.7,260.2z
               M164.6,107.3c0-0.3,0.1-0.6,0.1-0.8c3.3-71.7,54.2-79.4,76-79.4h0.4c0.2,0,0.5,0,0.8,0c27,0.6,72.9,11.6,76,79.4
              c0,0.3,0,0.6,0.1,0.8c0.1,0.7,7.1,68.7-24.7,104.5c-12.6,14.2-29.4,21.2-51.5,21.4c-0.2,0-0.3,0-0.5,0l0,0c-0.2,0-0.3,0-0.5,0
              c-22-0.2-38.9-7.2-51.4-21.4C157.7,176.2,164.5,107.9,164.6,107.3z"></path>
              <path fill="url(#gradient-2)" d="M446.8,383.6c0-0.1,0-0.2,0-0.3c0-0.8-0.1-1.6-0.1-2.5c-0.6-19.8-1.9-66.1-45.3-80.9c-0.3-0.1-0.7-0.2-1-0.3
              c-45.1-11.5-82.6-37.5-83-37.8c-6.1-4.3-14.5-2.8-18.8,3.3c-4.3,6.1-2.8,14.5,3.3,18.8c1.7,1.2,41.5,28.9,91.3,41.7
              c23.3,8.3,25.9,33.2,26.6,56c0,0.9,0,1.7,0.1,2.5c0.1,9-0.5,22.9-2.1,30.9c-16.2,9.2-79.7,41-176.3,41
              c-96.2,0-160.1-31.9-176.4-41.1c-1.6-8-2.3-21.9-2.1-30.9c0-0.8,0.1-1.6,0.1-2.5c0.7-22.8,3.3-47.7,26.6-56
              c49.8-12.8,89.6-40.6,91.3-41.7c6.1-4.3,7.6-12.7,3.3-18.8c-4.3-6.1-12.7-7.6-18.8-3.3c-0.4,0.3-37.7,26.3-83,37.8
              c-0.4,0.1-0.7,0.2-1,0.3c-43.4,14.9-44.7,61.2-45.3,80.9c0,0.9,0,1.7-0.1,2.5c0,0.1,0,0.2,0,0.3c-0.1,5.2-0.2,31.9,5.1,45.3
              c1,2.6,2.8,4.8,5.2,6.3c3,2,74.9,47.8,195.2,47.8s192.2-45.9,195.2-47.8c2.3-1.5,4.2-3.7,5.2-6.3
              C447,415.5,446.9,388.8,446.8,383.6z"></path></g><defs><linearGradient id="gradient-1" x1="0" y1="0" x2="80%" y2="80%">
              <stop stop-color="rgb(81,162,233)" offset="0%"></stop><stop stop-color="rgb(168,120,162)" offset="100%"></stop>
              </linearGradient><linearGradient id="gradient-2" x1="20%" y1="20%" x2="100%" y2="100%"><stop stop-color="rgb(168,120,162)" offset="0%"></stop>
              <stop stop-color="rgb(255,77,90)" offset="100%"></stop></linearGradient></defs></svg>
          </div>

          <div id="about-text" style={{height: '50vh', paddingTop: '40px'}}>
            <p class = "about-text">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
            It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          </div>
          
        </div>

        <div id="stack" style={{ height: '100vh', paddingTop: '80px'}}>
          <div id="stack-title">
            <h1 class="title">Stack</h1>
          </div>
          

          <div id="stack-icons" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '64px',gap: '64px'}}>
  
            <div id="web-dev-icons" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '64px'}}>
              
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" label="HTML" />
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg" label="JavaScript" />
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" label="CSS"/>
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" label="React.js" /> 
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" label="Express.js" background="linear-gradient(135deg, #ffffff, #444444)"/>
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" label="Node.js"/>
            </div>
            
            <div id="back-end-icons" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '64px'}}>
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" label="Java"/>
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" label="CSharp"/>
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg" label="Rust" background="linear-gradient(135deg, #ff6b35, #b7410e)"/>
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" label="Python" />


              {/* <img class="stack-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tauri/tauri-original.svg" /> */}
            </div>

            <div id="tools-and-platforms" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '64px'}}>
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" label="VS Code"/>
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" label="GitHub" background="linear-gradient(135deg, #4078c0, #255483)" />
              <StackIcon src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" label="Firebase" />

            </div>

          </div>
        </div>
        <div id="projects" style={{ height: '100vh', paddingTop: '80px'}}>
          <h1 class="title" >Projects</h1>
        </div>
        <div id="contact" style={{ height: '70vh', paddingTop: '80px'}}>
          <h1 class="title" >Contact</h1>
        </div>

      </div>

      </div>

    </div>
  )
}