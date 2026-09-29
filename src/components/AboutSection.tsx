import { motion } from "framer-motion";
import { Users, Code, Lightbulb } from "lucide-react";

const AboutSection = () => {
  return (
  <section id="sobre" className="py-24 bg-muted/50">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Sobre a <span className="text-gradient">Norte4j</span>
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          A Norte4j é a comunidade de desenvolvedores Java e Kotlin da Região Norte do Brasil. Nosso objetivo é conectar profissionais, compartilhar conhecimento e fortalecer o ecossistema de tecnologia na Amazônia através de meetups, palestras e eventos presenciais.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, label: "Comunidade", text: "Rede de devs da Região Norte" },
            { icon: Code, label: "Conhecimento", text: "Palestras e workshops técnicos" },
            { icon: Lightbulb, label: "Inovação", text: "Novas tecnologias e tendências" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mb-4">
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

export default AboutSection;
