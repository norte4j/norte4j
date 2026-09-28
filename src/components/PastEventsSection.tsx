import {motion} from "framer-motion";
import {ArrowRight, Calendar, Clock, MapPin} from "lucide-react";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {EventItem, eventsApi} from "@/lib/mock-api.ts";

const PastEventsSection = () => {
  const [pastEvents, setPastEvents] = useState<Array<Partial<EventItem> & { title: string; slug: string }>>([]);
  useEffect(() => {
    eventsApi.getAll().then((data) => {
      if (data.length) setPastEvents(data.filter((event) => event.status === "finished"));
    }).catch(() => undefined);
  }, []);
  return (
    <section className="py-24 bg-muted/40" aria-labelledby="past-events-title">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
        >
        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          Nossa história
        </span>
          <h2
            id="past-events-title"
            className="font-display text-3xl md:text-4xl font-bold text-foreground"
          >
            Eventos <span className="text-gradient">Anteriores</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Relembre os encontros que ajudaram a fortalecer a comunidade Java e Kotlin na Região Norte.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pastEvents.map((event, index) => (
            <motion.article
              key={event.title}
              className="relative bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated transition-shadow group"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: 0.1 * index}}
            >
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 bg-emerald-600 text-white">
              Encerrado
            </span>
              <h3 className="font-display text-lg font-bold text-foreground mb-3">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {event.description}
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary"/>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary"/>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary"/>
                  <span>{event.location}</span>
                </div>
              </div>
              {event.slug && (
                <Link
                  to={`/evento/${event.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Ver detalhes <ArrowRight className="w-3.5 h-3.5"/>
                </Link>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
};

export default PastEventsSection;
