import {useEffect, useRef, useState} from "react";
import {teamApi, uploadsApi, type SocialIcon, type SocialLink, type TeamMember} from "@/lib/mock-api";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Facebook, Github, ImageIcon, Instagram, Link, Linkedin, Pencil, Plus, Trash2, Upload, X} from "lucide-react";
import {toast} from "sonner";

const emptyLink = (): SocialLink => ({url: "", icone: "link"});
const socialOptions: {value: SocialIcon; label: string; icon: typeof Link}[] = [
  {value: "link", label: "Link", icon: Link},
  {value: "linkedin", label: "LinkedIn", icon: Linkedin},
  {value: "facebook", label: "Facebook", icon: Facebook},
  {value: "github", label: "GitHub", icon: Github},
  {value: "instagram", label: "Instagram", icon: Instagram},
];
const normalizeLinks = (items: TeamMember["redes_sociais"] | string[] = []): SocialLink[] =>
  items.map((item) => typeof item === "string" ? {url: item, icone: "link"} : item);

const CmsTeam = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [creating, setCreating] = useState(false);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [papel, setPapel] = useState("");
  const [links, setLinks] = useState<SocialLink[]>([emptyLink()]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const load = () => teamApi.getAll().then(setMembers).catch(() => toast.error("Erro ao carregar a equipe"));
  useEffect(() => { load(); }, []);

  const reset = () => {
    setCreating(false); setEditing(null); setNome(""); setIdade(""); setPapel(""); setLinks([emptyLink()]);
    setImageFile(null); setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };
  const openCreate = () => { reset(); setCreating(true); };
  const openEdit = (member: TeamMember) => {
    setCreating(false); setEditing(member); setNome(member.nome); setIdade(String(member.idade)); setPapel(member.papel);
    setLinks(member.redes_sociais?.length ? normalizeLinks(member.redes_sociais) : [emptyLink()]); setImagePreview(member.foto || null); setImageFile(null);
  };
  const changeLink = (index: number, field: keyof SocialLink, value: string) => setLinks((current) => current.map((link, i) => i === index ? {...link, [field]: value} : link));
  const addLink = () => links.length < 4 && setLinks((current) => [...current, emptyLink()]);
  const removeLink = (index: number) => setLinks((current) => current.length === 1 ? [emptyLink()] : current.filter((_, i) => i !== index));

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) return toast.error("Selecione uma imagem de até 10 MB");
    setImageFile(file); setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const age = Number(idade);
    const socialLinks = links.map((link) => ({...link, url: link.url.trim()})).filter((link) => link.url);
    if (!nome.trim() || !papel.trim() || !Number.isInteger(age) || age < 0) return toast.error("Preencha nome, idade válida e papel");
    if (socialLinks.length > 4 || socialLinks.some((link) => { try { new URL(link.url); return false; } catch { return true; } })) return toast.error("Informe até 4 links válidos, incluindo https://");
    try {
      const foto = imageFile ? (await uploadsApi.uploadImage(imageFile)).url : editing?.foto;
      const data = {nome: nome.trim(), idade: age, papel: papel.trim(), foto, redes_sociais: socialLinks};
      if (editing) { await teamApi.update(editing.id, data); toast.success("Integrante atualizado!"); }
      else { await teamApi.create(data); toast.success("Integrante adicionado!"); }
      reset(); load();
    } catch { toast.error("Erro ao salvar integrante"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este integrante?")) return;
    try { await teamApi.delete(id); toast.success("Integrante excluído"); load(); } catch { toast.error("Erro ao excluir integrante"); }
  };

  const showForm = creating || editing;
  return <div>
    <div className="flex items-center justify-between mb-6"><div><h1 className="font-display text-3xl font-bold text-foreground">Equipe</h1><p className="text-muted-foreground mt-1">Gerencie quem faz parte da comunidade.</p></div>{!showForm && <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2"/> Novo Integrante</Button>}</div>
    {showForm && <div className="bg-card rounded-xl border border-border p-6 mb-6 shadow-card">
      <div className="flex items-center justify-between mb-4"><h2 className="font-display text-lg font-bold">{editing ? "Editar Integrante" : "Novo Integrante"}</h2><button onClick={reset}><X className="w-5 h-5"/></button></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="idade">Idade</Label><Input id="idade" type="number" min="0" step="1" value={idade} onChange={(e) => setIdade(e.target.value)} /></div>
        <div className="space-y-2 md:col-span-2"><Label htmlFor="papel">Papel (cargo na comunidade)</Label><Input id="papel" value={papel} onChange={(e) => setPapel(e.target.value)} placeholder="Ex.: Organizador, Community Lead" /></div>
        <div className="space-y-2 md:col-span-2"><Label>Foto</Label><div onClick={() => imageInputRef.current?.click()} className="cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-border hover:border-primary/50">{imagePreview ? <img src={imagePreview} alt="Preview" className="h-48 w-full object-contain"/> : <div className="flex flex-col items-center py-8 text-muted-foreground"><Upload className="mb-2 h-8 w-8"/><span>Enviar imagem</span><span className="text-xs">PNG, JPG ou WEBP (máx. 10 MB)</span></div>}</div><input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>{imagePreview && <span className="flex items-center gap-2 text-xs text-muted-foreground"><ImageIcon className="w-4 h-4"/>Imagem selecionada</span>}</div>
        <div className="space-y-3 md:col-span-2"><div className="flex items-center justify-between"><Label>Redes sociais (máximo 4)</Label>{links.length < 4 && <Button type="button" variant="outline" size="sm" onClick={addLink}><Plus className="w-4 h-4 mr-1"/> Link</Button>}</div>{links.map((link, index) => { const SelectedIcon = socialOptions.find((option) => option.value === link.icone)?.icon || Link; return <div key={index} className="flex gap-2"><div className="relative w-40 shrink-0"><SelectedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"/><select aria-label={`Ícone da rede social ${index + 1}`} value={link.icone} onChange={(e) => changeLink(index, "icone", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{socialOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div><Input aria-label={`Rede social ${index + 1}`} value={link.url} onChange={(e) => changeLink(index, "url", e.target.value)} placeholder="https://..."/><Button type="button" variant="ghost" size="icon" onClick={() => removeLink(index)} aria-label={`Remover rede social ${index + 1}`}><X className="w-4 h-4"/></Button></div>;})}</div>
      </div>
      <div className="flex gap-3 mt-6"><Button onClick={handleSave}>{editing ? "Salvar" : "Criar"}</Button><Button variant="outline" onClick={reset}>Cancelar</Button></div>
    </div>}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{members.map((member) => <article key={member.id} className="bg-card rounded-xl border border-border p-6 shadow-card">{member.foto && <img src={member.foto} alt={member.nome} className="w-24 h-24 rounded-full object-cover mb-4"/>}<h3 className="font-display font-bold text-lg">{member.nome}</h3><p className="text-primary text-sm font-medium">{member.papel}</p><p className="text-sm text-muted-foreground mt-1">{member.idade} anos</p><div className="flex flex-wrap gap-3 mt-3">{normalizeLinks(member.redes_sociais).map((social) => { const Icon = socialOptions.find((option) => option.value === social.icone)?.icon || Link; return <a key={`${social.icone}-${social.url}`} href={social.url} target="_blank" rel="noopener noreferrer" title={social.icone} className="text-primary"><Icon className="w-4 h-4"/></a>; })}</div><div className="flex gap-2 mt-5"><button onClick={() => openEdit(member)} aria-label={`Editar ${member.nome}`}><Pencil className="w-4 h-4"/></button><button onClick={() => handleDelete(member.id)} aria-label={`Excluir ${member.nome}`} className="hover:text-destructive"><Trash2 className="w-4 h-4"/></button></div></article>)}{members.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum integrante cadastrado</div>}</div>
  </div>;
};

export default CmsTeam;
