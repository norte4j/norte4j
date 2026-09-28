import { useEffect, useRef, useState } from "react";
import { eventsApi, uploadsApi, workshopsApi, type EventItem } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";

const emptyEvent: Omit<EventItem, "id"> = {
  title: "", slug: "", date: "", time: "", location: "",
  description: "", longDescription: "", status: "soon", topics: [],
};

const CmsEvents = ({ kind = "events" }: { kind?: "events" | "workshops" }) => {
  const resourceApi = kind === "workshops" ? workshopsApi : eventsApi;
  const pageTitle = kind === "workshops" ? "Workshops" : "Eventos";
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState(emptyEvent);
  const [topicsInput, setTopicsInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const load = () => resourceApi.getAll().then(setEvents);
  useEffect(() => {
    let active = true;
    setEvents([]);
    setLoading(true);
    setLoadError(false);
    resourceApi.getAll().then((items) => {
      if (active) setEvents(items);
    }).catch(() => {
      if (active) setLoadError(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [kind, resourceApi]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyEvent);
    setTopicsInput("");
    setImageFile(null);
    setImagePreview(null);
    setCreating(true);
  };

  const openEdit = (event: EventItem) => {
    setCreating(false);
    setEditing(event);
    setForm(event);
    setTopicsInput(event.topics.join(", "));
    setImageFile(null);
    setImagePreview(event.image || null);
  };

  const close = () => {
    setCreating(false); setEditing(null); setImageFile(null); setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Selecione apenas imagens"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("A imagem deve ter no máximo 10 MB"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const data = { ...form, topics: topicsInput.split(",").map((t) => t.trim()).filter(Boolean) };
    try {
      if (imageFile) data.image = (await uploadsApi.uploadImage(imageFile)).url;
      if (editing) {
        await resourceApi.update(editing.id, data);
        toast.success("Evento atualizado!");
      } else {
        await resourceApi.create(data);
        toast.success("Evento criado!");
      }
      close();
      load();
    } catch {
      toast.error("Erro ao salvar evento");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este evento?")) return;
    await resourceApi.delete(id);
    toast.success("Evento excluído");
    load();
  };

  const showForm = creating || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">{pageTitle}</h1>
        {!showForm && (
          <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Novo Evento</Button>
        )}
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-foreground">
              {editing ? "Editar Evento" : "Novo Evento"}
            </h2>
            <button onClick={close} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="dd/mm/aaaa" />
            </div>
            <div className="space-y-2">
              <Label>Horário</Label>
              <Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Local</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "upcoming" | "soon" | "finished" })}
              >
                <option value="upcoming">Confirmado</option>
                <option value="soon">Em breve</option>
                <option value="finished">Encerrado</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Descrição curta</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Descrição completa</Label>
              <Textarea value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} rows={4} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Tópicos (separados por vírgula)</Label>
              <Input value={topicsInput} onChange={(e) => setTopicsInput(e.target.value)} placeholder="Spring Boot, Kotlin, ..." />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Imagem</Label>
              <div onClick={() => imageInputRef.current?.click()} className="relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-border hover:border-primary/50">
                {imagePreview ? <img src={imagePreview} alt="Preview" className="h-40 w-full object-cover" /> : <div className="flex flex-col items-center py-8 text-muted-foreground"><Upload className="mb-2 h-8 w-8" /><span className="text-sm">Clique para enviar uma imagem</span><span className="text-xs">PNG, JPG ou WEBP (máx. 10 MB)</span></div>}
              </div>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {imagePreview && <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><ImageIcon className="h-4 w-4" />Imagem selecionada</div>}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave}>{editing ? "Salvar" : "Criar"}</Button>
            <Button variant="outline" onClick={close}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Título</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Data</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Carregando conteúdo...</td></tr>
            )}
            {!loading && loadError && (
              <tr><td colSpan={4} className="p-8 text-center text-destructive">Não foi possível carregar o conteúdo.</td></tr>
            )}
            {!loading && !loadError && events.map((event) => (
              <tr key={event.id} className="border-b border-border last:border-0">
                <td className="p-4 text-sm font-medium text-foreground">{event.title}</td>
                <td className="p-4 text-sm text-muted-foreground">{event.date}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    event.status === "upcoming" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                  }`}>
                    {event.status === "upcoming" && <span className="ml-2 text-xs font-normal">Confirmado</span>}
                    {event.status === "soon" && <span className="ml-2 text-xs font-normal">Em breve</span>}
                    {event.status === "finished" && <span className="ml-2 text-xs font-normal">Encerrado</span>}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEdit(event)} className="text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4 inline" /></button>
                  <button onClick={() => handleDelete(event.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
            {!loading && !loadError && events.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nenhum evento cadastrado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CmsEvents;
