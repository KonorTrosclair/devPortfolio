import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense } from 'react'
import NeonScene from './NeonScene'
import PortfolioScene, { StackIcon, NeonTitleText, ProfileImage } from './portfolioScene'


const base = import.meta.env.BASE_URL
const BASE_COLOR = '#009bf5'

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
            {/* <NeonTitleText color={BASE_COLOR} fontSize="2rem" className="neon-title">
              About
            </NeonTitleText> */}
            
            <h1 class="title" >About</h1>
          </div>
          
          <div id="about-svg" style={{height: '30vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ProfileImage/>
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
          <div id="contact-title">
              <h1 class="title" >Contact</h1>
          </div>

          <div id="contact-form">
            <form className="contact-form" action="https://api.web3forms.com/submit" method="POST">
              <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_KEY} />
              <input type="hidden" name="subject" value="New Portfolio Contact" />
              <input className="contact-form-name" name="name" placeholder="Name" />
              <input className="contact-form-email" type="email" name="email" placeholder="Email" />
              <textarea className="contact-form-message" name="message" placeholder="Message" />
              <button type="submit" className="contact-form-submit">SUBMIT</button>
            </form>
          </div>
          
        </div>

      </div>

      </div>

    </div>
  )
}