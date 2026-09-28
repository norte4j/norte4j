import { useEffect, useState } from 'react';
import { contactsApi, type ContactItem } from '@/lib/mock-api';
import { Mail, Phone } from 'lucide-react';

const CmsContacts = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  useEffect(() => { contactsApi.getAll().then(setContacts); }, []);
  return <div><h1 className="font-display text-3xl font-bold mb-6">Contatos</h1><div className="space-y-4">{contacts.map((contact) => <article key={contact.id} className="rounded-xl border bg-card p-5 shadow-card"><div className="flex flex-wrap justify-between gap-2"><h2 className="font-bold">{contact.name}</h2><span className="text-xs text-muted-foreground">{contact.createdAt ? new Date(contact.createdAt).toLocaleString('pt-BR') : ''}</span></div><div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground"><a href={`mailto:${contact.email}`} className="flex items-center gap-1"><Mail className="h-4 w-4" />{contact.email}</a>{contact.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{contact.phone}</span>}</div>{contact.subject && <p className="mt-3 font-medium">{contact.subject}</p>}<p className="mt-1 whitespace-pre-wrap text-sm">{contact.message}</p></article>)}{!contacts.length && <p className="py-12 text-center text-muted-foreground">Nenhum contato recebido.</p>}</div></div>;
};
export default CmsContacts;
