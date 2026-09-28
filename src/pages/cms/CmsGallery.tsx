import { useEffect, useState, useRef } from "react";
import { galleryApi, siteConfigApi, uploadsApi, type GalleryPhoto } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const CmsGallery = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => galleryApi.getAll().then(setPhotos);
  useEffect(() => { load(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione apenas arquivos de imagem");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem deve ter no máximo 5MB");
      return;
    }
    setFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      if (!alt) setAlt(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!preview || !file) { toast.error("Selecione uma imagem"); return; }
    if (!alt) { toast.error("Preencha a descrição"); return; }
    try {
      const uploaded = await uploadsApi.uploadImage(file);
      await galleryApi.create({ src: uploaded.url, alt, storagePath: uploaded.path, type: uploaded.type });
      toast.success("Foto adicionada!");
      setPreview(null); setFile(null); setAlt(""); setCreating(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      load();
    } catch {
      toast.error("Não foi possível enviar a imagem");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta foto?")) return;
    await galleryApi.delete(id);
    toast.success("Foto excluída");
    load();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const from = photos.findIndex((photo) => photo.id === draggingId);
    const to = photos.findIndex((photo) => photo.id === targetId);
    if (from < 0 || to < 0) return;
    const reordered = [...photos];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    const ordered = reordered;
    setPhotos(ordered);
    setDraggingId(null);
    try {
      await siteConfigApi.set("gallery.order", ordered.map((photo) => photo.id));
      toast.success("Ordem da galeria salva!");
    } catch {
      toast.error("Não foi possível salvar a ordem da galeria");
      load();
    }
  };

  const close = () => {
    setCreating(false); setPreview(null); setFile(null); setAlt("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Galeria</h1>
        {!creating && <Button onClick={() => setCreating(true)}><Plus className="w-4 h-4 mr-2" /> Adicionar Foto</Button>}
      </div>

      {creating && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-foreground">Nova Foto</h2>
            <button onClick={close} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload area */}
            <div className="space-y-2">
              <Label>Imagem</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors overflow-hidden"
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-full aspect-video object-cover rounded-lg" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="absolute top-2 right-2 bg-foreground/70 text-background rounded-full p-1 hover:bg-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Upload className="w-10 h-10 mb-3" />
                    <p className="text-sm font-medium">Clique para enviar uma imagem</p>
                    <p className="text-xs mt-1">PNG, JPG ou WEBP (máx. 5MB)</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Descrição da foto</Label>
                <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Ex: Palestras do meetup" />
              </div>

              {preview && (
                <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">Imagem pronta para upload</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleCreate} disabled={!preview}>Adicionar</Button>
            <Button variant="outline" onClick={close}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} draggable onDragStart={() => setDraggingId(photo.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => handleDrop(photo.id)} className={`relative group bg-card rounded-xl border border-border overflow-hidden shadow-card cursor-grab active:cursor-grabbing ${draggingId === photo.id ? "opacity-50" : ""}`}>
            <img src={photo.src} alt={photo.alt} className="w-full aspect-video object-cover" />
            <div className="p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground truncate">{photo.alt}</span>
              <button onClick={() => handleDelete(photo.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">Nenhuma foto na galeria</div>
        )}
      </div>
    </div>
  );
};

export default CmsGallery;
