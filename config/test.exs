import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :moon_live_view_docs, MoonLiveViewDocsWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "P6Ry9WqZtQn9cso73poPnn9mN16q26bDf6VE09NzdBam0ZWfNsEDnX//ZeOncwQK",
  server: false

# In test we don't send emails
config :moon_live_view_docs, MoonLiveViewDocs.Mailer, adapter: Swoosh.Adapters.Test

# Disable swoosh api client as it is only required for production adapters
config :swoosh, :api_client, false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

# Enable helpful, but potentially expensive runtime checks
config :phoenix_live_view,
  enable_expensive_runtime_checks: true
