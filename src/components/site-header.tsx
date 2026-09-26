import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

const links = [["À propos", "#a-propos"], ["Expertise", "#competences"], ["Projets", "#projets"], ["Documents", "#documents"], ["Contact", "#contact"]];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="shell header-inner">
    <Link to="/" className="brand" aria-label="Accueil Ivana Tamno"><span className="brand-moon" />IT<span className="brand-name">Ivana Tamno</span></Link>
    <nav className="desktop-nav" aria-label="Navigation principale">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
    <div className="header-actions"><ThemeToggle/><Button variant="ghost" size="icon" className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Ouvrir le menu">{open ? <X/> : <Menu/>}</Button></div>
  </div>{open && <nav className="mobile-nav" aria-label="Navigation mobile">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}</nav>}</header>;
}
