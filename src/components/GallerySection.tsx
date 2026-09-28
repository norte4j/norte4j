import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Camera} from "lucide-react";
import {galleryApi, siteConfigApi, type GalleryPhoto} from "@/lib/mock-api";

const GallerySection = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    galleryApi.getAll().then((items) => {
      if (!active) return;
      setPhotos(items);
      siteConfigApi.getAll().then((config) => {
        const configuredOrder = Array.isArray(config["gallery.order"]) ? config["gallery.order"] as string[] : [];
        if (!configuredOrder.length || !active) return;
        const positions = new Map(configuredOrder.map((id, index) => [id, index]));
        setPhotos([...items].sort((a, b) => (positions.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (positions.get(b.id) ?? Number.MAX_SAFE_INTEGER)));
      }).catch(() => {
        // A configuração é opcional; a galeria mantém a ordem retornada pela API.
      });
    }).catch(() => {
      if (active) setPhotos([]);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <section id="galeria" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}}>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4"><Camera className="w-4 h-4" /> Galeria</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Momentos da <span className="text-gradient">Comunidade</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loading && <div className="col-span-full py-12 text-center text-muted-foreground">Carregando galeria...</div>}
          {!loading && photos.map((photo, i) => (
            <motion.div key={photo.id} className={`relative group overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2" : ""}`} initial={{opacity: 0, scale: 0.95}} whileInView={{opacity: 1, scale: 1}} viewport={{once: true}} transition={{delay: 0.08 * i}}>
              <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-end"><span className="text-primary-foreground text-sm font-medium px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{photo.alt}</span></div>
            </motion.div>
          ))}
          {!loading && photos.length === 0 && <div className="col-span-full py-12 text-center text-muted-foreground">Nenhuma foto disponível.</div>}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
