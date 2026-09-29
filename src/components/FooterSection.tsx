import { Linkedin, Instagram } from "lucide-react";
import WhatsAppLogo from "@/assets/wpp.png";
import GithubLogo from "@/assets/github.png";

const WhatsAppLogoComponent = () => (
  <img src={WhatsAppLogo} style={{ width: '24px', height: '24px', filter: "brightness(0) invert(0.7)" }} alt="WhatsApp Logo"/>
)

const GithubLogoComponent = () => (
  <img src={GithubLogo} style={{ width: '24px', height: '24px', filter: "brightness(0) invert(0.7)" }} alt="Github Logo"/>
)

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/norte4j/" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/norte4j" },
  { icon: WhatsAppLogoComponent, label: "WhatsApp", href: "https://chat.whatsapp.com/CEC5j1W4Rcb7vRuRQZ03xj" },
  { icon: GithubLogoComponent, label: "Github", href: "https://github.com/norte4j" },
];

const FooterSection = () => {
  return (
  <footer className="py-12 bg-foreground">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center gap-6">
        <p className="font-display text-xl font-bold text-primary-foreground">Norte4j</p>
        <p className="text-sm text-primary-foreground/60">
          Java & Kotlin Community - Região Norte
        </p>

        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              data-analytics-tag={`footer_${s.label.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <s.icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        <p className="text-xs text-primary-foreground/40">
          &copy; {new Date().getFullYear()} Norte4j. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
  );
};

export default FooterSection;
