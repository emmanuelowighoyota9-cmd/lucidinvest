-- Additive migration: customer wallets plus the deposit/withdrawal request queue.
--
-- No wallet is created with a balance and no external payment rail is connected.
-- A wallet balance only ever comes from ledger entries posted by staff: a wallet
-- transfer posts both sides in one statement, and a deposit or withdrawal becomes
-- a balance only when staff process the customer's request.

CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  wallet_number TEXT NOT NULL UNIQUE,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, currency)
);
CREATE INDEX IF NOT EXISTS wallets_user_id_idx ON wallets(user_id);

-- A ledger entry now belongs to exactly one owner: a trading account or a wallet.
ALTER TABLE ledger_entries ADD COLUMN IF NOT EXISTS wallet_id UUID REFERENCES wallets(id) ON DELETE RESTRICT;
ALTER TABLE ledger_entries ALTER COLUMN account_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ledger_entries_single_owner') THEN
    ALTER TABLE ledger_entries
      ADD CONSTRAINT ledger_entries_single_owner CHECK ((account_id IS NULL) <> (wallet_id IS NULL));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS ledger_entries_wallet_id_created_at_idx ON ledger_entries(wallet_id, created_at DESC);

CREATE TABLE IF NOT EXISTS wallet_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE RESTRICT,
  kind TEXT NOT NULL CHECK (kind IN ('deposit', 'withdrawal')),
  amount NUMERIC(24, 8) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'posted', 'rejected')),
  reference TEXT NOT NULL UNIQUE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES app_users(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS wallet_requests_user_id_created_at_idx ON wallet_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS wallet_requests_status_created_at_idx ON wallet_requests(status, created_at DESC);

INSERT INTO schema_migrations (version) VALUES ('0006_wallet')
ON CONFLICT (version) DO NOTHING;
