import commerceImage from "@/assets/projet-commerce.jpg";
import nexusImage from "@/assets/projet-nexuspress.jpg";
import vraiDealImage from "@/assets/projet-vraideal.jpg";

export type Project = {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  technologies: string[];
  features: string[];
  role: string;
  status: string;
  image_key: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  published?: boolean;
  featured?: boolean;
  sort_order?: number;
};

export const projectImages: Record<string, string> = {
  commerce: commerceImage,
  nexuspress: nexusImage,
  vraideal: vraiDealImage,
};

export const fallbackProjects: Project[] = [
  {
    slug: "gestionnaire-commerce",
    title: "Gestionnaire de commerce",
    summary: "Une application offline-first pensée avec et pour les petits commerçants camerounais.",
    problem: "Les outils classiques répondent mal aux contraintes de connexion, aux usages et à la littératie numérique de nombreux petits commerces.",
    solution: "Une expérience simple et traçable, utilisable hors connexion, structurée en six MVP évolutifs et testée sur le terrain à Mboppi, Douala.",
    technologies: ["Flutter", "Spring Boot", "PostgreSQL", "SQLite"],
    features: ["Caisse", "Stocks", "Crédit client", "Dépenses", "Facturation", "Tableau de bord"],
    role: "Analyse terrain, conception produit et développement",
    status: "Projet pilote à Mboppi, Douala",
    image_key: "commerce",
    featured: true,
  },
  {
    slug: "nexuspress",
    title: "NexusPress",
    summary: "Une plateforme éditoriale multi-rôles inspirée des standards académiques.",
    problem: "Coordonner auteurs, correcteurs et responsables éditoriaux dans un parcours cohérent.",
    solution: "Une architecture propre, sept modules et treize espaces fonctionnels responsives.",
    technologies: ["Flutter Web & Mobile", "Clean Architecture", "Riverpod", "GoRouter", "Material 3"],
    features: ["Auteur", "Correcteur", "Comité de lecture", "Rédacteur en chef", "Administration"],
    role: "Conception UX/UI et architecture applicative",
    status: "En développement",
    image_key: "nexuspress",
  },
  {
    slug: "vraideal",
    title: "VraiDeal",
    summary: "Un concept de marketplace camerounaise combinant revente et location.",
    problem: "Créer davantage de confiance dans les transactions entre acheteurs et vendeurs.",
    solution: "Des annonces vérifiées, un intermédiaire, le paiement séquestré et des parcours multi-rôles.",
    technologies: ["Cahier des charges", "Prototype HTML interactif"],
    features: ["Annonces vérifiées", "Paiement séquestré", "Mobile Money", "Confirmation WhatsApp"],
    role: "Analyse métier, cahier des charges et prototypage",
    status: "Conception / prototypage",
    image_key: "vraideal",
  },
];

export const skills = [
  { title: "Mobile & Front-end", items: ["Flutter", "Dart", "Material 3", "Riverpod", "GoRouter", "Clean Architecture", "Null Safety"] },
  { title: "Backend & données", items: ["Spring Boot", "PostgreSQL", "SQLite", "Synchronisation par journal de mouvements"] },
  { title: "Web & outils", items: ["HTML", "CSS", "PHP", "VB.NET", "MySQL", "Git", "GitHub", "Prototypage interactif"] },
  { title: "Méthode & produit", items: ["Analyse métier", "Cahiers des charges", "Conception UX/UI", "Découpage en MVP", "Tests nominaux et limites"] },
];
