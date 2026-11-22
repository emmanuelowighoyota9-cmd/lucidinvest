-- Additive migration: the contact form collects an optional phone number.
ALTER TABLE contact_enquiries ADD COLUMN IF NOT EXISTS phone TEXT;

INSERT INTO schema_migrations (version) VALUES ('0005_contact_phone')
ON CONFLICT (version) DO NOTHING;
