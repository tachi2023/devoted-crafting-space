CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_portfolio_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR lower(COALESCE(auth.jwt()->>'email', '')) <> 'ivanatamno@gmail.com' THEN
    RAISE EXCEPTION 'Accès refusé';
  END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_portfolio_admin() TO authenticated;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.portfolio_settings (
  id text PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
  full_name text NOT NULL DEFAULT 'TAMNO NGUEMTIO IVANA LESLINE',
  professional_title text NOT NULL DEFAULT 'Développeuse Web & Mobile',
  location text NOT NULL DEFAULT 'Douala, Cameroun',
  email text NOT NULL DEFAULT 'ivanatamno@gmail.com',
  phones text[] NOT NULL DEFAULT ARRAY['6 80 27 22 00','6 55 77 29 42'],
  github_url text NOT NULL DEFAULT 'https://github.com/tahi2023',
  linkedin_url text NOT NULL DEFAULT 'https://linkedin.com/in/tahi2023',
  tagline text NOT NULL DEFAULT 'Je transforme les idées et les besoins métier en expériences digitales utiles, modernes et évolutives.',
  bio text NOT NULL DEFAULT 'Étudiante en Licence 3 Génie Logiciel à l’Institut Universitaire du Golfe de Guinée et développeuse d’applications mobiles et web, spécialisée en Flutter/Dart, architecture logicielle, Spring Boot et PostgreSQL.',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_settings TO anon, authenticated;
GRANT UPDATE ON public.portfolio_settings TO authenticated;
GRANT ALL ON public.portfolio_settings TO service_role;
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads settings" ON public.portfolio_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin updates settings" ON public.portfolio_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL,
  problem text NOT NULL DEFAULT '',
  solution text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}',
  features text[] NOT NULL DEFAULT '{}',
  role text NOT NULL DEFAULT 'Conception et développement',
  status text NOT NULL DEFAULT 'En conception',
  image_key text,
  github_url text,
  demo_url text,
  published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published projects" ON public.projects FOR SELECT TO anon USING (published = true);
CREATE POLICY "Authenticated reads published projects" ON public.projects FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin inserts projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin updates projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin deletes projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX projects_public_order_idx ON public.projects (published, featured DESC, sort_order);

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL UNIQUE CHECK (kind IN ('cv','motivation')),
  title text NOT NULL,
  storage_path text,
  file_name text,
  published boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.documents TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published documents" ON public.documents FOR SELECT TO anon USING (published = true);
CREATE POLICY "Authenticated reads documents" ON public.documents FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manages documents" ON public.documents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public sends contact messages" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (char_length(name) BETWEEN 2 AND 100 AND char_length(message) BETWEEN 10 AND 4000);
CREATE POLICY "Admin reads messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin updates messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin deletes messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin uploads portfolio files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin reads portfolio files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'portfolio-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin updates portfolio files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-files' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'portfolio-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin deletes portfolio files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-files' AND public.has_role(auth.uid(), 'admin'));