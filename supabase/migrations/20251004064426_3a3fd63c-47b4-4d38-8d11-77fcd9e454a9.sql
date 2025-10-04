-- Fix Function Search Path Mutable warning
-- Ensure all functions have proper search_path set

-- Update search_knowledge_base function
CREATE OR REPLACE FUNCTION public.search_knowledge_base(search_query text)
RETURNS TABLE(id uuid, title text, content text, category text, module_number integer, section text, relevance real)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    kb.id,
    kb.title,
    kb.content,
    kb.category,
    kb.module_number,
    kb.section,
    ts_rank(
      to_tsvector('english', kb.title || ' ' || kb.content || ' ' || array_to_string(kb.keywords, ' ')),
      plainto_tsquery('english', search_query)
    ) as relevance
  FROM public.knowledge_base kb
  WHERE 
    kb.is_searchable = true
    AND (
      to_tsvector('english', kb.title || ' ' || kb.content || ' ' || array_to_string(kb.keywords, ' ')) 
      @@ plainto_tsquery('english', search_query)
    )
  ORDER BY relevance DESC, kb.module_number ASC;
$$;

-- Update grant_admin_role_to_user function
CREATE OR REPLACE FUNCTION public.grant_admin_role_to_user(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = user_email;
    
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'admin'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END;
$$;

-- Update grant_admin_role_to_initial_user function
CREATE OR REPLACE FUNCTION public.grant_admin_role_to_initial_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'nealtitus4823@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;