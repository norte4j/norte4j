import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Facebook, Github, Instagram, Link, Linkedin, UserRound} from "lucide-react";
import {teamApi, type SocialIcon, type TeamMember} from "@/lib/mock-api";

const socialIcons = {link: Link, linkedin: Linkedin, facebook: Facebook, github: Github, instagram: Instagram};
const normalizeSocial = (social: TeamMember["redes_sociais"][number] | string) =>
  typeof social === "string" ? {url: social, icone: "link" as SocialIcon} : social;

const TeamSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    teamApi.getAll().then((items) => active && setMembers(items)).catch(() => active && setMembers([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <section id="equipe" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-14" initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Quem faz acontecer</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">Nossa <span className="text-gradient">Equipe</span></h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Conheça as pessoas que constroem e fortalecem a comunidade Norte4j.</p>
        </motion.div>

        {loading && <p className="text-center text-muted-foreground">Carregando equipe...</p>}
        {!loading && members.length === 0 && <p className="text-center text-muted-foreground">Nossa equipe será apresentada em breve.</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member, index) => (
            <motion.article key={member.id} className="bg-card rounded-2xl border border-border p-6 text-center shadow-card" initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{delay: index * 0.08}}>
              {member.foto ? <img src={member.foto} alt={member.nome} className="w-28 h-28 mx-auto rounded-full object-cover ring-4 ring-primary/10" /> : <div className="w-28 h-28 mx-auto rounded-full bg-primary/10 flex items-center justify-center"><UserRound className="w-12 h-12 text-primary" /></div>}
              <h3 className="font-display text-xl font-bold text-foreground mt-5">{member.nome}</h3>
              <p className="text-primary font-medium mt-1">{member.papel}</p>
              <div className="flex justify-center flex-wrap gap-2 mt-4">
                {member.redes_sociais?.map((item) => {
                  const social = normalizeSocial(item);
                  const Icon = socialIcons[social.icone] || Link;
                  return <a key={`${social.icone}-${social.url}`} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`${social.icone} de ${member.nome}`} title={social.icone} className="p-2 rounded-full bg-muted text-muted-foreground hover:text-primary transition-colors"><Icon className="w-4 h-4" /></a>;
                })}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
