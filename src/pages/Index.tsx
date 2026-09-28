import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TopicsSection from "@/components/TopicsSection";
import EventsSection from "@/components/EventsSection";
import PastEventsSection from "@/components/PastEventsSection";
import GallerySection from "@/components/GallerySection";
import AboutSection from "@/components/AboutSection";
import PartnershipsSection from "@/components/PartnershipsSection";
import AudienceSection from "@/components/AudienceSection";
import FooterSection from "@/components/FooterSection";
import TeamSection from "@/components/TeamSection";

const Index = () => (
  <main>
    <Header />
    <HeroSection />
    <TopicsSection />
    <EventsSection />
    <PastEventsSection />
    <GallerySection />
    <AboutSection />
    <TeamSection />
    <PartnershipsSection />
    {/*<AudienceSection />*/}
    <FooterSection />
  </main>
);

export default Index;
