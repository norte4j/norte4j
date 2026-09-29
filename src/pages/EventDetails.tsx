import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowLeft, Users, ExternalLink, Linkedin } from "lucide-react";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import JoaoPhoto from "@/assets/palestrantes/joao.png";
import MairtonPhoto from "@/assets/palestrantes/mairton.png";
import YuriPhoto from "@/assets/palestrantes/yuri.png";
import RafaelHenriquePhoto from "@/assets/palestrantes/rafael_henrique.png";
import RafaelCardosoPhoto from "@/assets/palestrantes/rafael_cardoso.png";
import RodrigoPhoto from "@/assets/palestrantes/rodrigo.png";
import FernandaPhoto from "@/assets/palestrantes/fernanda.png";

const JoaoPhotoView = () => (
  <img src={JoaoPhoto} />
)

const MairtonPhotoView = () => (
  <img src={MairtonPhoto} />
)

const FernandaPhotoView = () => (
  <img src={FernandaPhoto} />
)

const RafaelHenriquePhotoView = () => (
  <img src={RafaelHenriquePhoto} />
)

const RafaelCardosoPhotoView = () => (
  <img src={RafaelCardosoPhoto} />
)

const RodrigoPhotoView = () => (
  <img src={RodrigoPhoto} />
)
const YuriPhotoView = () => (
  <img src={YuriPhoto} />
)

const eventsData: Record<string, {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
  longDescription: string;
  status: "upcoming" | "soon";
  topics: string[];
  speakers: { name: string; role: string; talk: string, link: string, photo: () => JSX.Element }[];
  capacity: string;
}> = {
  "1-meetup-norte4j": {
    title: "1º Meetup Norte4j",
    date: "11/04/2026",
    time: "08:00h às 17:00h",
    location: "Belém — PA",
    address: "Faci Wyden - Batista Campos",
    description: "Nosso primeiro encontro presencial com palestras sobre Spring Boot, Kotlin e arquitetura de software.",
    longDescription:
      "O 1º Meetup Norte4j é o marco inicial da comunidade Java & Kotlin da Região Norte. Um dia inteiro dedicado a compartilhar conhecimento, networking e fortalecer o ecossistema de tecnologia na Amazônia. Teremos palestras técnicas, workshops práticos e muito espaço para troca de experiências entre desenvolvedores de todos os níveis.",
    status: "upcoming",
    topics: ["Spring Boot", "Kotlin", "Arquitetura de Software", "Microsserviços", "Clean Code", "Testes Automatizados"],
    speakers: [
      {
        name: "João Antônio",
        role: "Palestrante",
        talk: "Testando falhas em microserviços Java: resiliência real com Testcontainers e Resilience4j",
        link: "https://www.linkedin.com/in/juaoantonio",
        photo: JoaoPhotoView
      },
      {
        name: "Mairton Leal",
        role: "Palestrante",
        talk: "Do Requisito ao App: Integrações e Análise de Falhas Mobile",
        link: "https://www.linkedin.com/in/project-spiders",
        photo: MairtonPhotoView
      },
      {
        name: "Fernanda Ramalho",
        role: "Palestrante",
        talk: "Além do código: arquitetura, IA e os desafios reais do backend moderno",
        link: "https://www.linkedin.com/in/fernandaramalho/",
        photo: FernandaPhotoView
      },
      {
        name: "Rafael Henrique",
        role: "Palestrante",
        talk: "Pipeline pattern: implementando integrações simplificadas no spring",
        link: "#",
        photo: RafaelHenriquePhotoView
      },
      {
        name: "Rafael Cardoso",
        role: "Palestrante",
        talk: "Faculdade não ensina tudo: o que realmente diferencia um desenvolvedor em tempos de IA",
        link: "https://www.linkedin.com/in/rafaelcardoso11",
        photo: RafaelCardosoPhotoView
      },
      {
        name: "Yuri Pimentel",
        role: "Palestrante",
        talk: "COHOST: Faculdade não ensina tudo: o que realmente diferencia um desenvolvedor em tempos de IA",
        link: "https://www.linkedin.com/in/yuri-pimentel-pinto-dev/",
        photo: YuriPhotoView
      },
      {
        name: "Rodrigo Silva",
        role: "Palestrante",
        talk: "Mamãe, perdi a JVM! Java nativo em contextos serverless",
        link: "https://www.linkedin.com/in/rodrigo-silva-9961a3202",
        photo: RodrigoPhotoView
      },
    ],
    capacity: "120 vagas",
  },
  "workshop-kotlin-android": {
    title: "Workshop Kotlin para Android",
    date: "Em breve",
    time: "A definir",
    location: "Belém — PA",
    address: "Local a confirmar",
    description: "Hands-on de desenvolvimento mobile com Kotlin, Jetpack Compose e boas práticas.",
    longDescription:
      "Um workshop intensivo focado em desenvolvimento Android moderno com Kotlin. Os participantes vão aprender desde os fundamentos do Jetpack Compose até padrões avançados de arquitetura mobile, com exercícios práticos e projetos hands-on.",
    status: "soon",
    topics: ["Kotlin", "Jetpack Compose", "Android", "MVVM", "Coroutines", "Material Design 3"],
    speakers: [],
    capacity: "50 vagas",
  },
  "hackathon-norte4j": {
    title: "Hackathon Norte4j",
    date: "Em breve",
    time: "A definir",
    location: "Belém — PA",
    address: "Local a confirmar",
    description: "Maratona de programação com desafios reais usando tecnologias Java e Kotlin.",
    longDescription:
      "O Hackathon Norte4j reunirá equipes de desenvolvedores para resolver desafios reais usando o ecossistema Java e Kotlin. Serão 24 horas de programação intensa, com mentores experientes, prêmios para os melhores projetos e muita diversão.",
    status: "soon",
    topics: ["Java", "Kotlin", "Spring Boot", "APIs REST", "Banco de Dados", "DevOps"],
    speakers: [],
    capacity: "80 vagas (equipes de 3-5)",
  },
};

const EventDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const event = slug ? eventsData[slug] : null;

  if (!event) {
    return (
      <main>
        <Header />
        <section className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">Evento não encontrado</h1>
            <Link to="/" data-analytics-tag="event_not_found_back" className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Voltar ao início
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="gradient-hero pt-28 pb-16">
        <div className="container mx-auto px-6">
          <Link
            to="/"
            data-analytics-tag="event_back"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span
              className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${
                event.status === "upcoming"
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary-foreground/20 text-primary-foreground"
              }`}
            >
              {event.status === "upcoming" ? "Confirmado" : "Em breve"}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">{event.title}</h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">{event.description}</p>

            <div className="flex flex-wrap gap-6 mt-8 text-primary-foreground/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">{event.capacity}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Main */}
            <div className="lg:col-span-2 space-y-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Sobre o evento</h2>
                <p className="text-muted-foreground leading-relaxed">{event.longDescription}</p>
              </motion.div>

              {/* Topics */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Temas abordados</h2>
                <div className="flex flex-wrap gap-2">
                  {event.topics.map((topic) => (
                    <span
                      key={topic}
                      className="bg-secondary/10 text-secondary text-sm font-medium px-4 py-2 rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Speakers */}
              {event.speakers.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">Palestrantes</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {event.speakers.map((speaker, i) => (
                      <div key={i} className="bg-card rounded-xl p-5 border border-border shadow-card">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 overflow-hidden">
                          { speaker.photo() }
                          {/*<Users className="w-6 h-6 text-primary" />*/}
                        </div>
                        <h3 className="font-display font-bold text-foreground">{speaker.name}</h3>
                        <p className="text-sm text-muted-foreground">{speaker.role}</p>
                        <p className="text-sm text-primary font-medium mt-2">{speaker.talk}</p>

                        <div className="flex items-center gap-2 mt-4">
                          <a href={speaker.link} data-analytics-tag="speaker_linkedin" target="_blank">
                            <Linkedin className="w-5 h-5 text-primary hover:text-primary/80 transition-colors" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-card rounded-2xl p-6 border border-border shadow-card sticky top-24 space-y-6">
                <h3 className="font-display text-lg font-bold text-foreground">Informações</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Data</span>
                    <p className="font-medium text-foreground">{event.date}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Horário</span>
                    <p className="font-medium text-foreground">{event.time}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Local</span>
                    <p className="font-medium text-foreground">{event.location}</p>
                    <p className="text-muted-foreground">{event.address}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capacidade</span>
                    <p className="font-medium text-foreground">{event.capacity}</p>
                  </div>
                </div>

                {event.status === "upcoming" ? (
                  <a
                    href="https://www.sympla.com.br/evento/meetup-norte4j---java--kotlin-community/3341647"
                    data-analytics-tag="event_registration"
                    target="_blank"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-xl transition-all hover:shadow-elevated text-center"
                  >
                    Inscreva-se <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="bg-muted text-muted-foreground text-center font-medium px-6 py-3 rounded-xl">
                    Inscrições em breve
                  </div>
                )}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default EventDetails;
