import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [state, setState] = useState<"idle"|"sending"|"sent"|"error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("sending");
    const form = new FormData(event.currentTarget);
    if (form.get("company")) { setState("sent"); return; }
    const payload = { name: String(form.get("name") || "").trim(), email: String(form.get("email") || "").trim(), subject: String(form.get("subject") || "").trim(), message: String(form.get("message") || "").trim() };
    const { error } = await supabase.from("contact_messages").insert(payload);
    if (error) setState("error"); else { event.currentTarget.reset(); setState("sent"); }
  }
  return <form className="contact-form" onSubmit={submit}>
    <div className="form-grid"><label>Nom<Input name="name" required minLength={2} autoComplete="name" /></label><label>Email<Input name="email" type="email" required autoComplete="email" /></label></div>
    <label>Sujet<Input name="subject" required minLength={3} /></label><label className="honeypot" aria-hidden="true">Entreprise<Input name="company" tabIndex={-1} autoComplete="off" /></label>
    <label>Message<Textarea name="message" required minLength={10} rows={6} /></label>
    <div className="form-footer"><Button type="submit" size="lg" disabled={state === "sending"}><Send/>{state === "sending" ? "Envoi…" : "Envoyer le message"}</Button><span role="status">{state === "sent" ? "Message bien reçu. Merci !" : state === "error" ? "L’envoi a échoué. Écrivez-moi directement par email." : ""}</span></div>
  </form>;
}
