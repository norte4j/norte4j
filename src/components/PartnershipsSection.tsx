import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Handshake} from "lucide-react";
import {partnersApi, type Partner} from "@/lib/mock-api";

const partnerBenefits = [
  "Visibilidade para sua marca na comunidade tech",
  "Networking com desenvolvedores qualificados",
  "Participação ativa nos eventos e meetups",
  "Fortalecimento do ecossistema de tecnologia na Amazônia",
];

const PartnershipsSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    partnersApi.getAll().then((items) => {
      if (active) setPartners(items);
    }).catch(() => {
      if (active) setPartners([]);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="parcerias" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-14" initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}>
          <span
            className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{display: 'none'}}>
            <Handshake className="w-4 h-4"/> Parcerias
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Nossos <span className="text-gradient">Parceiros</span> e <span className="text-gradient">Apoiadores</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Empresas e comunidades que acreditam no poder da tecnologia na Região Norte.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {loading && <div className="md:col-span-2 text-center text-muted-foreground">Carregando parceiros...</div>}
          {!loading && partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              onClick={() => partner.link && window.open(partner.link, '_blank', 'noopener,noreferrer')}
              className={`bg-card rounded-2xl p-8 shadow-card border border-border text-center transition-shadow ${partner.link ? "hover:cursor-pointer hover:shadow-elevated" : ""}`}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: 0.1 * i}}
            >
              {partner.image ?
                <img src={partner.image} alt={partner.name} className="h-20 w-full object-contain mb-5"/> :
                <Handshake className="h-16 w-16 mx-auto mb-5 text-primary"/>}
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{partner.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{partner.description}</p>
            </motion.div>
          ))}
          {!loading && partners.length === 0 &&
              <div className="md:col-span-2 text-center text-muted-foreground">Nenhum parceiro cadastrado.</div>}
        </div>

        <motion.div className="bg-card rounded-2xl p-10 max-w-2xl mx-auto text-center shadow-card border border-border"
                    initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}}>
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">Quer ser parceiro?</h3>
          <ul className="text-sm text-muted-foreground space-y-2 mb-6 max-w-md mx-auto text-left">
            {partnerBenefits.map((benefit) => <li key={benefit} className="flex items-start gap-2"><span
              className="text-primary mt-0.5">✓</span>{benefit}</li>)}
          </ul>
          <a href="mailto:marcelodaniel.daniel@gmail.com"
             className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-xl transition-all hover:shadow-elevated">Entre
            em Contato</a>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnershipsSection;
