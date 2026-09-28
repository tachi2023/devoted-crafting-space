import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { isSupabaseConfigured, supabase, supabaseConfigurationMessage } from "@/integrations/supabase/client";
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
    if (!isSupabaseConfigured) { setState("error"); return; }
    try {
      const { error } = await supabase.from("contact_messages").insert(payload);
      if (error) setState("error"); else { event.currentTarget.reset(); setState("sent"); }
    } catch { setState("error"); }
  }
  return <form className={`contact-form ${state === "sent" ? "is-sent" : ""}`} onSubmit={submit}>
    <div className="form-grid"><label>Nom<Input name="name" required minLength={2} autoComplete="name" /></label><label>Email<Input name="email" type="email" required autoComplete="email" /></label></div>
    <label>Sujet<Input name="subject" required minLength={3} /></label><label className="honeypot" aria-hidden="true">Entreprise<Input name="company" tabIndex={-1} autoComplete="off" /></label>
    <label>Message<Textarea name="message" required minLength={10} rows={6} /></label>
    <div className="form-footer"><Button type="submit" size="lg" disabled={state === "sending" || state === "sent"}>{state === "sent" ? <CheckCircle2/> : <Send/>}{state === "sending" ? "Envoi…" : state === "sent" ? "Message envoyé" : "Envoyer le message"}</Button><span className={state === "sent" ? "form-success" : ""} role="status">{state === "sent" ? "Message bien reçu. Merci !" : state === "error" ? `${isSupabaseConfigured ? "L’envoi a échoué. Écrivez-moi directement par email." : supabaseConfigurationMessage}` : ""}</span></div>
  </form>;
}
