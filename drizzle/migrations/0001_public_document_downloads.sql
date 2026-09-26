-- Published portfolio documents can be downloaded by public visitors.
-- Files remain scoped to the dedicated `documents/` prefix in the portfolio bucket.
CREATE POLICY "Public downloads published portfolio documents"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-files' AND name LIKE 'documents/%');
