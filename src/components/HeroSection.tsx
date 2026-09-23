import {motion} from "framer-motion";
import {Calendar, MapPin, Clock} from "lucide-react";
import logo from "@/assets/logo2.png";

const HeroSection = () => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
    {/* Network pattern overlay */}
    <div className="absolute inset-0 opacity-10">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1.5" fill="currentColor"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-primary-foreground"/>
      </svg>
    </div>

    <div className="relative z-10 container mx-auto px-6 text-center">
      <motion.img
        src={logo}
        alt="Norte4j Logo"
        className="mx-auto w-36 h-36 md:w-48 md:h-48 mb-6 drop-shadow-lg"
        initial={{scale: 0, rotate: -180}}
        animate={{scale: 1, rotate: 0}}
        transition={{type: "spring", stiffness: 100, delay: 0.2}}
      />

      <motion.h1
        className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-3"
        initial={{opacity: 0, y: 30}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.4}}
      >
        Norte4j
      </motion.h1>

      <motion.p
        className="text-xl md:text-2xl text-primary-foreground/90 font-medium mb-10"
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.6}}
      >
        Java & Kotlin Community
      </motion.p>

      {/* Meetup CTA */}
      <motion.div
        className="bg-card/95 backdrop-blur-md rounded-2xl p-8 md:p-10 max-w-2xl mx-auto shadow-elevated event-img-background"
        initial={{opacity: 0, y: 40}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.8}}
      >
        <div className="z-10 relative">
          <span
            className="inline-block bg-accent text-accent-foreground text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
          Próximo Encontro
        </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 text-white">
            Inside Banking Tech: Java & Kotlin em Produção
          </h2>
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary text-white"/>
              <span className="font-medium text-white">23/09/2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary text-white"/>
              <span className="font-medium text-white">20:00h</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary text-white"/>
              <span className="font-medium text-white">Online - Google Meet</span>
            </div>
          </div>
          <a
            href="https://chat.whatsapp.com/CEC5j1W4Rcb7vRuRQZ03xj"
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-3.5 rounded-xl transition-all hover:shadow-elevated"
          >
            Acessar Encontro
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
