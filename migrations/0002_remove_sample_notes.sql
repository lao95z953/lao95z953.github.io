-- Remove the seeded sample notes and the integration-test note from the
-- guestbook. The pinned welcome note ('sample-welcome') is intentionally kept.
DELETE FROM guestbook_notes
WHERE id IN ('sample-writeups', 'sample-ctf', 'sample-tools');

-- Matched by author rather than id: the integration-test note is written at
-- runtime, so its id is a random uuid and differs per environment.
DELETE FROM guestbook_notes
WHERE author = 'integration_test';
