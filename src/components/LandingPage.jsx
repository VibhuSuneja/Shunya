import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

// --- Premium UI Components ---

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const RevealText = ({ text, delay = 0, className = "" }) => {
  const words = text.split(" ");
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
        hidden: {}
      }}
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block mr-[0.3em] mb-[0.2em]">
          <motion.span
            variants={{
              hidden: { y: "150%", opacity: 0, rotateZ: 5 },
              visible: { y: "0%", opacity: 1, rotateZ: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="inline-block origin-bottom-left"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

const Section = ({ children, className = "", id = "" }) => (
  <section id={id} className={`min-h-screen w-full flex flex-col relative px-6 py-24 md:px-24 md:py-32 ${className}`}>
    {children}
  </section>
);

const PremiumCard = ({ num, title, subtitle, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -10, transition: { duration: 0.4 } }}
    className="relative group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-[#4ecdc4]/30 hover:bg-white/[0.04] transition-all duration-700 backdrop-blur-md overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#4ecdc4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    <span className="text-[#4ecdc4]/40 font-ui text-xs tracking-[0.2em] mb-6 block uppercase">{num}</span>
    <h3 className="text-4xl font-display text-[#f5f0e8] group-hover:text-[#4ecdc4] transition-colors duration-500 mb-2">{title}</h3>
    <p className="text-[#f7bd48] font-ui text-sm tracking-[0.15em] uppercase mb-6">{subtitle}</p>
    <div className="w-8 h-[1px] bg-white/20 mb-6 group-hover:w-16 group-hover:bg-[#4ecdc4] transition-all duration-500" />
    <p className="text-[#f5f0e8]/60 font-body text-lg leading-relaxed">{desc}</p>
  </motion.div>
);

const NavBar = ({ onBegin }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${
        scrolled 
          ? "py-4 bg-[#050508]/40 border-b border-white/5 backdrop-blur-xl px-6 md:px-24" 
          : "py-10 bg-transparent px-8 md:px-32"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center w-full">
        <motion.div 
          className="flex items-center space-x-3 group cursor-default"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4ecdc4] shadow-[0_0_15px_rgba(78,205,196,0.5)]" />
            <motion.div 
              className="absolute inset-0 w-full h-full rounded-full bg-[#4ecdc4] opacity-40" 
              animate={{ scale: [1, 2.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </div>
          <span className="font-display text-2xl tracking-[0.25em] uppercase text-white group-hover:text-[#4ecdc4] transition-colors duration-500">
            Shunya
          </span>
        </motion.div>
        
        <div className="flex items-center space-x-10 md:space-x-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
              hidden: {}
            }}
            className="flex items-center space-x-10 md:space-x-16"
          >
            <motion.a 
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              href="#philosophy" 
              className="relative group font-ui text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/50 hover:text-white transition-colors duration-500"
            >
              <span>About Us</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#4ecdc4] transition-all duration-500 group-hover:w-full" />
            </motion.a>
            
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="group relative px-6 py-2 overflow-hidden rounded-full border border-white/10 hover:border-[#f7bd48]/50 transition-colors duration-500">
                    <span className="relative z-10 font-ui text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#f7bd48]">
                      Sign In
                    </span>
                    <div className="absolute inset-0 bg-[#f7bd48]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <button 
                  onClick={onBegin}
                  className="group relative px-6 py-2 overflow-hidden rounded-full border border-white/10 hover:border-[#4ecdc4]/50 transition-colors duration-500"
                >
                  <span className="relative z-10 font-ui text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#4ecdc4]">
                    The Journey
                  </span>
                  <div className="absolute inset-0 bg-[#4ecdc4]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </SignedIn>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

// --- Main Page ---

export default function LandingPage({ onBegin }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax values
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 800]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Mouse trail effect (Glow)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto overflow-x-hidden bg-[#050508] text-[#f5f0e8] selection:bg-[#4ecdc4]/30 font-body relative scroll-smooth">
      
      <NavBar onBegin={onBegin} />
      <NoiseOverlay />

      {/* Reactive Cursor Glow */}
      <motion.div 
        className="fixed top-0 left-0 w-[600px] h-[600px] bg-[#4ecdc4]/10 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"
        animate={{ x: mousePos.x - 300, y: mousePos.y - 300 }}
        transition={{ type: "spring", damping: 40, stiffness: 100, mass: 0.5 }}
      />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[150vh]">
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
          
          {/* Parallax Background */}
          <motion.div 
            style={{ y: heroY, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050508]/50 to-[#050508] z-10" />
            <img 
              src="/images/hero-void.png" 
              alt="The Infinite Void" 
              className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
            />
          </motion.div>

          {/* Hero Content */}
          <motion.div style={{ opacity: heroOpacity }} className="relative z-20 flex flex-col items-center text-center w-full px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <h1 className="text-[15vw] md:text-[12rem] font-display tracking-normal text-transparent bg-clip-text bg-gradient-to-b from-white to-[#f5f0e8]/40 leading-none pb-4 drop-shadow-2xl">
                SHUNYA
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1.5 }}
              className="mt-4 font-ui text-sm md:text-md tracking-[0.4em] uppercase text-[#f7bd48]/80 font-light"
            >
              The 90-Day Ritual of the Witness
            </motion.p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 2 }}
            className="absolute bottom-12 z-20 flex flex-col items-center space-y-4"
          >
            <span className="font-ui text-xs tracking-[0.3em] uppercase text-white/40">Descend</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-white/40 to-transparent overflow-hidden">
              <motion.div 
                className="w-full h-1/2 bg-[#4ecdc4]" 
                animate={{ y: [ -40, 64 ] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 bg-[#050508]">
        
        {/* --- PHILOSOPHY SECTION --- */}
        <Section id="philosophy" className="justify-center items-center">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <RevealText 
                text="The Architecture of Stillness." 
                className="text-5xl md:text-7xl font-display text-[#f5f0e8] leading-[1.1] mb-8" 
              />
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-2xl md:text-3xl text-[#f5f0e8]/70 font-display font-light leading-relaxed max-w-2xl"
              >
                In an era of relentless algorithmic noise, Shunya is a sanctuary engineered for <span className="text-[#4ecdc4] italic">Productive Discomfort</span>. It is not a tool to manage your time, but a space to reclaim your soul.
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-[#4ecdc4]/20 to-[#1a1a3e]/40 blur-2xl rounded-[3rem] z-0" />
              <div className="relative z-10 p-10 md:p-14 bg-white/[0.01] border border-white/5 backdrop-blur-2xl rounded-[2rem] shadow-2xl">
                <h4 className="font-ui text-xs tracking-[0.2em] uppercase text-[#f7bd48] mb-8">The Axioms</h4>
                <ul className="space-y-8">
                  {[
                    { title: "Zero Tracking", desc: "Absolute privacy. Your resonance remains on your device." },
                    { title: "Neural Audio", desc: "Spatially engineered guidance designed for deep theta states." },
                    { title: "The Empty Chair", desc: "A psychological anchor to confront the static of the mind." }
                  ].map((item, i) => (
                    <li key={i} className="flex flex-col">
                      <span className="font-display text-2xl text-white mb-2">{item.title}</span>
                      <span className="font-ui text-sm text-white/50 leading-relaxed">{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* --- THE FOUR GATEWAYS --- */}
        <Section className="justify-center">
          <div className="max-w-7xl w-full mx-auto">
            <div className="mb-20 text-center flex flex-col items-center">
              <span className="w-[1px] h-24 bg-gradient-to-b from-transparent to-[#4ecdc4]/50 mb-8" />
              <RevealText text="The Four Gateways" className="text-5xl md:text-6xl font-display text-white justify-center" />
              <motion.p 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once:true }} transition={{ delay: 0.8, duration: 1 }}
                className="mt-6 text-[#f5f0e8]/50 font-ui tracking-widest uppercase text-sm max-w-lg mx-auto leading-loose"
              >
                A 90-day progression from the physical static to the formless witness.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PremiumCard 
                num="01" title="Jagrat" subtitle="The Waking" delay={0.2}
                desc="Days 1-7. Confronting the physical static. The mind demands distraction. We provide none."
              />
              <PremiumCard 
                num="02" title="Svapna" subtitle="The Dream" delay={0.4}
                desc="Days 8-21. Navigating the subconscious flow. The noise internalizes."
              />
              <PremiumCard 
                num="03" title="Sushupti" subtitle="Deep Sleep" delay={0.6}
                desc="Days 22-45. Merging with the silent dark. Thoughts lose their gravitational pull."
              />
              <PremiumCard 
                num="04" title="Turiya" subtitle="The Witness" delay={0.8}
                desc="Days 46-90. The observer of all. You are no longer the storm, but the sky."
              />
            </div>
          </div>
        </Section>

        {/* --- DIVIDER --- */}
        <div className="w-full flex justify-center py-20">
          <div className="w-[1px] h-40 bg-gradient-to-b from-[#4ecdc4]/0 via-[#4ecdc4]/50 to-[#4ecdc4]/0" />
        </div>

        {/* --- FINAL CTA --- */}
        <section className="min-h-[80vh] w-full flex flex-col items-center justify-center relative px-6 py-24 overflow-hidden">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none"
          >
            <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full border-[0.5px] border-[#4ecdc4]/20 animate-[spin_60s_linear_infinite]" />
            <div className="w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] absolute rounded-full border-[0.5px] border-[#f7bd48]/10 animate-[spin_40s_linear_infinite_reverse]" />
          </motion.div>

          <div className="relative z-10 flex flex-col items-centertext-center w-full max-w-4xl mx-auto">
            <RevealText 
              text="Are you ready to be nobody?" 
              className="text-6xl md:text-8xl font-display text-white text-center leading-[1] mb-16 justify-center"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 1 }}
              className="flex justify-center w-full"
            >
              <SignedOut>
                <SignInButton mode="modal">
                  <button 
                    className="group relative overflow-hidden rounded-full bg-white/[0.03] border border-white/10 px-12 py-6 backdrop-blur-xl transition-all duration-700 hover:bg-white/[0.08] hover:border-[#4ecdc4]/50 hover:shadow-[0_0_40px_rgba(78,205,196,0.2)]"
                  >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#4ecdc4] to-[#3aa8a0] transition-all duration-[800ms] ease-out group-hover:w-full z-0" />
                    <span className="relative z-10 text-white font-ui text-sm tracking-[0.4em] uppercase group-hover:text-[#050508] transition-colors duration-500 font-medium">
                      Enter The Shunya
                    </span>
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <button 
                  onClick={onBegin}
                  className="group relative overflow-hidden rounded-full bg-white/[0.03] border border-white/10 px-12 py-6 backdrop-blur-xl transition-all duration-700 hover:bg-white/[0.08] hover:border-[#4ecdc4]/50 hover:shadow-[0_0_40px_rgba(78,205,196,0.2)]"
                >
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#4ecdc4] to-[#3aa8a0] transition-all duration-[800ms] ease-out group-hover:w-full z-0" />
                  <span className="relative z-10 text-white font-ui text-sm tracking-[0.4em] uppercase group-hover:text-[#050508] transition-colors duration-500 font-medium">
                    Continue Ritual
                  </span>
                </button>
              </SignedIn>
            </motion.div>
          </div>
          
          <footer className="absolute bottom-8 w-full flex flex-col items-center space-y-6">
            <div className="flex space-x-12 opacity-30 hover:opacity-100 transition-opacity duration-700">
              <a href="#" className="font-ui text-[10px] tracking-[0.3em] uppercase hover:text-[#4ecdc4] transition-colors">Twitter</a>
              <a href="#" className="font-ui text-[10px] tracking-[0.3em] uppercase hover:text-[#4ecdc4] transition-colors">GitHub</a>
              <a href="#" className="font-ui text-[10px] tracking-[0.3em] uppercase hover:text-[#4ecdc4] transition-colors">Instagram</a>
            </div>
            <p className="text-[#f5f0e8]/10 font-ui text-[8px] tracking-[0.4em] uppercase">
              Shunya Ritual • Local First • Ciphered Mind
            </p>
          </footer>
        </section>

      </div>
    </div>
  );
}

