import {useEffect, useRef, useState} from "react";
import {partnersApi, uploadsApi, type Partner} from "@/lib/mock-api";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {ImageIcon, Plus, Pencil, Trash2, Upload, X, ExternalLink} from "lucide-react";
import {toast} from "sonner";

const CmsPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const load = () => partnersApi.getAll().then(setPartners);
  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setLink("");
    setImageFile(null);
    setImagePreview(null);
    setCreating(true);
  };
  const openEdit = (p: Partner) => {
    setCreating(false);
    setEditing(p);
    setName(p.name);
    setDescription(p.description);
    setLink(p.link || "");
    setImageFile(null);
    setImagePreview(p.image || null);
  };
  const close = () => {
    setCreating(false);
    setEditing(null);
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione apenas imagens");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 10 MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name) {
      toast.error("Preencha o nome");
      return;
    }
    try {
      const image = imageFile ? (await uploadsApi.uploadImage(imageFile)).url : editing?.image;
      if (editing) {
        await partnersApi.update(editing.id, {name, description, link: link || undefined, image});
        toast.success("Parceiro atualizado!");
      } else {
        await partnersApi.create({name, description, link: link || undefined, image});
        toast.success("Parceiro adicionado!");
      }
      close();
      load();
    } catch {
      toast.error("Erro ao salvar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este parceiro?")) return;
    await partnersApi.delete(id);
    toast.success("Parceiro excluído");
    load();
  };

  const showForm = creating || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Parceiros</h1>
        {!showForm && <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2"/> Novo Parceiro</Button>}
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-foreground">
              {editing ? "Editar Parceiro" : "Novo Parceiro"}
            </h2>
            <button onClick={close} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5"/>
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}/>
            </div>
            <div className="space-y-2">
              <Label>Link (opcional)</Label>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..."/>
            </div>
            <div className="space-y-2">
              <Label>Imagem</Label>
              <div onClick={() => imageInputRef.current?.click()}
                   className="relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-border hover:border-primary/50">
                {imagePreview ? <img src={imagePreview} alt="Preview" className="h-40 w-full object-contain"/> :
                  <div className="flex flex-col items-center py-8 text-muted-foreground"><Upload
                    className="mb-2 h-8 w-8"/><span className="text-sm">Clique para enviar uma imagem</span><span
                    className="text-xs">PNG, JPG ou WEBP (máx. 10 MB)</span></div>}
              </div>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
              {imagePreview && <div className="flex items-center gap-2 text-xs text-muted-foreground"><ImageIcon
                  className="h-4 w-4"/>Imagem selecionada</div>}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSave}>{editing ? "Salvar" : "Criar"}</Button>
            <Button variant="outline" onClick={close}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((p) => (
          <div key={p.id} className="bg-card rounded-xl border border-border p-6 shadow-card">
            {p.image && <img src={p.image} alt={p.name} className="mb-4 h-32 w-full rounded-lg object-contain"/>}
            <h3 className="font-display font-bold text-foreground mb-2">{p.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
            {p.link && (
              <a href={p.link} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 mb-4">
                <ExternalLink className="w-3 h-3"/> {p.link}
              </a>
            )}
            {!p.link && <div className="mb-4"/>}
            <div className="flex gap-2">
              <button onClick={() => openEdit(p)} className="text-muted-foreground hover:text-foreground"><Pencil
                className="w-4 h-4"/></button>
              <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
        {partners.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum parceiro cadastrado</div>
        )}
      </div>
    </div>
  );
};

export default CmsPartners;
