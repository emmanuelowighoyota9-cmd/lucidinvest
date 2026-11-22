-- Additive migration: publishes the starting investment catalogue.
-- It creates no customer records, no accounts, no balances and no money movement.
-- Adjust names, descriptions, currencies and minimums to match the approved offering
-- before applying this to production.

INSERT INTO investment_products (id, name, description, currency, minimum_amount, status, terms_version)
VALUES
  ('7b1d3c52-9a4e-4c1f-8a52-5f0b7c61d101', 'Fixed Income Portfolio',
   'Short-duration bond portfolio managed to a defined maturity.', 'USD', 1000.00, 'active', '2026-01'),
  ('7b1d3c52-9a4e-4c1f-8a52-5f0b7c61d102', 'Balanced Growth Portfolio',
   'Diversified mix of global equities and investment-grade fixed income.', 'USD', 5000.00, 'active', '2026-01'),
  ('7b1d3c52-9a4e-4c1f-8a52-5f0b7c61d103', 'Global Equity Portfolio',
   'Actively managed portfolio of developed-market equities.', 'USD', 10000.00, 'active', '2026-01'),
  ('7b1d3c52-9a4e-4c1f-8a52-5f0b7c61d104', 'Euro Income Portfolio',
   'Euro-denominated fixed income portfolio for income-oriented mandates.', 'EUR', 1000.00, 'active', '2026-01'),
  ('7b1d3c52-9a4e-4c1f-8a52-5f0b7c61d105', 'Sterling Growth Portfolio',
   'Sterling-denominated growth portfolio of UK and global equities.', 'GBP', 5000.00, 'active', '2026-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO schema_migrations (version) VALUES ('0003_investment_catalogue')
ON CONFLICT (version) DO NOTHING;
