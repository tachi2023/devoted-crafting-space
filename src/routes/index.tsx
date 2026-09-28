import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, Code2, Download, Github, GraduationCap, Linkedin, Mail, MapPin, MoonStar, Phone, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { fallbackProjects, projectImages, skills } from "@/lib/portfolio-data";
import type { Project } from "@/lib/portfolio-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "TAMNO NGUEMTIO IVANA LESLINE | Développeuse Web & Mobile" },
    { name: "description", content: "Portfolio d’Ivana Tamno, développeuse Web & Mobile à Douala : Flutter, Spring Boot, PostgreSQL, UX/UI et conception produit." },
    { property: "og:title", content: "Ivana Tamno | Développeuse Web & Mobile" },
    { property: "og:description", content: "Des idées métier transformées en produits numériques utiles, modernes et évolutifs." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/" }] }),
  component: Index,
});

const process = [["01","Comprendre","Analyser le besoin et le problème métier."],["02","Concevoir","Transformer le besoin en solution et en expérience utilisateur."],["03","Développer","Construire le produit avec une architecture propre."],["04","Tester","Éprouver les cas nominaux et les cas limites."],["05","Améliorer","Observer les usages réels et faire évoluer le produit."]];
const projectFilters = ["Tous", "Mobile", "Web & Backend", "Conception"] as const;
type ProjectFilter = typeof projectFilters[number];

function getProjectCategory(project: Project): Exclude<ProjectFilter, "Tous"> {
  const source = `${project.technologies.join(" ")} ${project.title}`.toLowerCase();
  if (source.includes("flutter") || source.includes("mobile")) return "Mobile";
  if (source.includes("spring") || source.includes("postgres") || source.includes("web")) return "Web & Backend";
  return "Conception";
}

type PublicDocument = { kind: string; title: string; storage_path: string | null; file_name: string | null };

function Index() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [filter, setFilter] = useState<ProjectFilter>("Tous");
  const [documents, setDocuments] = useState<PublicDocument[]>([]);
  const [documentLinks, setDocumentLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadPublicContent() {
      const [projectResult, documentResult] = await Promise.all([
        supabase.from("projects").select("*").eq("published", true).order("featured", { ascending: false }).order("sort_order"),
        supabase.from("documents").select("kind,title,storage_path,file_name").eq("published", true),
      ]);
      if (projectResult.data?.length) setProjects(projectResult.data as Project[]);
      if (documentResult.data) {
        const publishedDocuments = documentResult.data as PublicDocument[];
        setDocuments(publishedDocuments);
        const signedLinks = await Promise.all(publishedDocuments.filter((document) => document.storage_path).map(async (document) => {
          const { data } = await supabase.storage.from("portfolio-files").createSignedUrl(document.storage_path!, 60 * 60);
          return [document.kind, data?.signedUrl] as const;
        }));
        setDocumentLinks(Object.fromEntries(signedLinks.filter(([, link]) => Boolean(link))) as Record<string, string>);
      }
    }
    void loadPublicContent();
  }, []);

  const visibleProjects = filter === "Tous" ? projects : projects.filter((project) => getProjectCategory(project) === filter);
  const documentFor = (kind: "cv" | "motivation") => documents.find((document) => document.kind === kind);

  return <div className="portfolio"><SiteHeader/><main>
    <section className="hero" id="accueil"><div className="stars" aria-hidden="true"/><div className="moon-scene" aria-hidden="true"><span className="moon-orbit"/><span className="moon-disc"/></div><div className="shell hero-content">
      <p className="eyebrow"><Sparkles/> Disponible pour des opportunités</p>
      <h1><span>TAMNO NGUEMTIO</span> IVANA LESLINE</h1><p className="hero-role">Développeuse Web <i>&</i> Mobile</p>
      <p className="hero-copy">Je transforme les idées et les besoins métier en expériences digitales <strong>utiles, modernes et évolutives.</strong></p>
      <div className="hero-cta"><Button asChild size="lg"><a href="#projets">Voir mes projets <ArrowDown/></a></Button><Button variant="outline" size="lg" disabled><Download/> CV bientôt disponible</Button></div>
      <div className="hero-meta"><span><MapPin/> Douala, Cameroun</span><span><GraduationCap/> Licence 3 Génie Logiciel</span></div>
    </div><div className="scroll-cue" aria-hidden="true">Explorer <ArrowDown/></div></section>

    <section className="section about" id="a-propos"><div className="shell about-grid"><div><p className="section-number">01 — À propos</p><h2>Penser le produit.<br/><em>Construire la solution.</em></h2></div><div className="about-copy"><p>Je suis étudiante en Licence 3 Génie Logiciel à l’Institut Universitaire du Golfe de Guinée et développeuse d’applications mobiles et web.</p><p>Spécialisée en Flutter/Dart, je pratique également l’architecture logicielle, le backend avec Spring Boot et PostgreSQL, ainsi que la conception UX/UI.</p><p>J’aborde chaque projet de bout en bout : compréhension du besoin, cahier des charges, conception, développement, tests et amélioration.</p><div className="discipline-row"><span>Mobile</span><span>Web</span><span>Backend</span><span>Produit</span></div><div className="impact-grid" aria-label="Repères professionnels"><article><strong>Flutter</strong><span>spécialisation mobile</span></article><article><strong>Spring Boot</strong><span>architecture &amp; données</span></article><article><strong>2</strong><span>diplômes en génie logiciel</span></article></div></div></div></section>

    <section className="section expertise" id="competences"><div className="shell"><p className="section-number">02 — Expertise</p><div className="section-heading"><h2>Une pratique technique,<br/><em>une vision produit.</em></h2><p>Des technologies choisies pour répondre au contexte réel, sans effets de mode ni faux pourcentages.</p></div><div className="skills-grid">{skills.map((group, i)=><article className="skill-block" key={group.title}><div className="skill-icon">{i === 0 ? <MoonStar/> : i === 1 ? <Code2/> : i === 2 ? <BriefcaseBusiness/> : <Sparkles/>}</div><h3>{group.title}</h3><div className="skill-list">{group.items.map(item=><span key={item}>{item}</span>)}</div></article>)}</div></div></section>

    <section className="section projects" id="projets"><div className="shell"><p className="section-number">03 — Réalisations</p><div className="section-heading"><h2>Des projets ancrés<br/><em>dans des besoins réels.</em></h2><p>Chaque réalisation part d’un problème concret et se construit autour de l’usage.</p></div><div className="project-filters" role="group" aria-label="Filtrer les projets">{projectFilters.map((item) => <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="projects-list">{visibleProjects.map((p,i)=><article className={`project-row ${i===0 ? "featured" : ""}`} key={p.slug}><div className="project-visual"><img src={projectImages[p.image_key || ""]} alt={`Illustration conceptuelle du projet ${p.title}`} loading="lazy" width={1408} height={912}/><small>Illustration conceptuelle</small></div><div className="project-info"><div className="project-index">0{i+1} {p.featured && <span>Projet majeur</span>}</div><h3>{p.title}</h3><p>{p.summary}</p><div className="tag-row">{p.technologies.map(t=><span key={t}>{t}</span>)}</div><p className="status">{p.status}</p><Button variant="outline" asChild><Link to="/projets/$slug" params={{slug:p.slug}}>Voir l’étude <ArrowUpRight/></Link></Button></div></article>)}{visibleProjects.length === 0 && <p className="empty-projects">Aucun projet dans cette catégorie pour le moment.</p>}</div></div></section>

    <section className="section method"><div className="shell"><p className="section-number">04 — Mon processus</p><h2>De l’intuition au produit,<br/><em>sans perdre le besoin de vue.</em></h2><div className="process-grid">{process.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

    <section className="section journey"><div className="shell journey-grid"><div><p className="section-number">05 — Formation</p><h2>Un parcours en<br/><em>construction continue.</em></h2><div className="timeline"><article><time>2025—2026</time><div><h3>Licence 3 Génie Logiciel</h3><p>Institut Universitaire du Golfe de Guinée, Douala · En cours</p></div></article><article><time>2024—2025</time><div><h3>BTS en Génie Logiciel</h3><p>Institut Universitaire du Golfe de Guinée, Douala</p></div></article></div></div><aside className="languages"><h3>Langues</h3><div><strong>Français</strong><span>Langue maternelle</span></div><div><strong>Anglais</strong><span>Niveau intermédiaire — en perfectionnement</span></div></aside></div></section>

    <section className="section documents" id="documents"><div className="shell"><p className="section-number">06 — Documents</p><div className="section-heading"><h2>Documents<br/><em>professionnels.</em></h2><p>Les versions officielles sont publiées depuis l’espace d’administration.</p></div><div className="document-grid">{(["cv", "motivation"] as const).map((kind) => { const document = documentFor(kind); const label = kind === "cv" ? "Curriculum Vitae" : "Lettre de motivation"; return <article key={kind}><span>{document ? "PDF · Disponible" : "PDF · À venir"}</span><h3>{document?.title || label}</h3><p>{kind === "cv" ? "Parcours, compétences et informations professionnelles." : "Présentation de mon approche et de mes motivations."}</p>{documentLinks[kind] ? <Button asChild><a href={documentLinks[kind]} target="_blank" rel="noreferrer"><Download/> Télécharger le PDF</a></Button> : <Button disabled><Download/> Bientôt disponible</Button>}</article>})}</div></div></section>

    <section className="section contact" id="contact"><div className="shell contact-grid"><div><p className="section-number">07 — Contact</p><h2>Construisons quelque<br/><em>chose d’utile ensemble.</em></h2><p>Un projet, une opportunité ou une idée à explorer ? Échangeons.</p><div className="contact-links"><a href="mailto:ivanatamno@gmail.com"><Mail/> ivanatamno@gmail.com</a><a href="tel:+237680272200"><Phone/> +237 6 80 27 22 00</a><a href="tel:+237655772942"><Phone/> +237 6 55 77 29 42</a><a href="https://github.com/tachi2023" target="_blank" rel="noreferrer"><Github/> github.com/tachi2023</a><a href="https://linkedin.com/in/tachi2023" target="_blank" rel="noreferrer"><Linkedin/> linkedin.com/in/tachi2023</a></div></div><ContactForm/></div></section>
  </main><footer><div className="shell footer-inner"><div><strong>TAMNO NGUEMTIO IVANA LESLINE</strong><span>Développeuse Web & Mobile</span></div><p>© 2026 · Conçu avec rigueur à Douala.</p><Link to="/auth">Administration</Link></div></footer></div>;
}
