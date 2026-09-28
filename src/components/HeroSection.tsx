import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import logo from "@/assets/logo2.png";
import { eventsApi, type EventItem } from "@/lib/mock-api";

const parseEventDate = (value: string): Date | null => {
  const normalized = value.trim();
  const brDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(normalized);
  if (brDate) {
    const date = new Date(Number(brDate[3]), Number(brDate[2]) - 1, Number(brDate[1]));
    return date.getFullYear() === Number(brDate[3]) && date.getMonth() === Number(brDate[2]) - 1 && date.getDate() === Number(brDate[1]) ? date : null;
  }
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(normalized);
  if (isoDate) {
    const date = new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
    return date.getFullYear() === Number(isoDate[1]) && date.getMonth() === Number(isoDate[2]) - 1 && date.getDate() === Number(isoDate[3]) ? date : null;
  }
  return null;
};

const findNextConfirmedEvent = (events: EventItem[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return events
    .map((event) => ({ event, parsedDate: parseEventDate(event.date) }))
    .filter(({ event, parsedDate }) => (event.status === "upcoming" || (event.status as string) === "confirmed") && parsedDate && parsedDate >= today)
    .sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime())[0]?.event ?? null;
};

const HeroSection = () => {
  const [nextEvent, setNextEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    let active = true;
    eventsApi.getAll()
      .then((events) => { if (active) setNextEvent(findNextConfirmedEvent(events)); })
      .catch(() => { if (active) setNextEvent(null); });
    return () => { active = false; };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="1.5" fill="currentColor" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-primary-foreground" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.img src={logo} alt="Norte4j Logo" className="mx-auto w-36 h-36 md:w-48 md:h-48 mb-6 drop-shadow-lg" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 100, delay: 0.2 }} />
        <motion.h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-3" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Norte4j</motion.h1>
        <motion.p className="text-xl md:text-2xl text-primary-foreground/90 font-medium mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>Java & Kotlin Community</motion.p>

        {nextEvent && (
          <motion.div className="bg-card/95 backdrop-blur-md rounded-2xl p-8 md:p-10 max-w-2xl mx-auto shadow-elevated event-img-background" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <div className="z-10 relative">
              <span className="inline-block bg-accent text-accent-foreground text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">Próximo encontro confirmado</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-white">{nextEvent.title}</h2>
              <div className="flex flex-wrap justify-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-white" /><span className="font-medium text-white">{nextEvent.date}</span></div>
                {nextEvent.time && <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-white" /><span className="font-medium text-white">{nextEvent.time}</span></div>}
                {nextEvent.location && <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-white" /><span className="font-medium text-white">{nextEvent.location}</span></div>}
              </div>
              <a href="#eventos" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-3.5 rounded-xl transition-all hover:shadow-elevated">Ver evento</a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
