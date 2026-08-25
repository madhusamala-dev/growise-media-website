DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Allow select leads'
      AND tablename = 'leads'
  ) THEN
    CREATE POLICY "Allow select leads" ON public.leads
      FOR SELECT USING (true);
  END IF;
END
$$;