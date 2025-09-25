defmodule MoonLiveViewDocs.MixProject do
  use Mix.Project

  @version (case File.read("VERSION") do
              {:ok, version} -> String.trim(version)
              {:error, _} -> "0.0.1"
            end)

  def project do
    [
      app: :moon_live_view_docs,
      version: @version,
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 1.14",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {MoonLiveViewDocs.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:bandit, "~> 1.6"},
      {:dns_cluster, "~> 0.2"},
      {:earmark, "~> 1.4"},
      {:esbuild, "~> 0.9", runtime: Mix.env() == :dev},
      {:finch, "~> 0.19"},
      {:gettext, "~> 0.26"},
      {:jason, "~> 1.4"},
      {:makeup, "~> 1.2"},
      {:makeup_eex, "~> 2.0"},
      {:makeup_elixir, "~> 1.0"},
      {:makeup_html, "~> 0.2.0"},
      {:moon_assets, "~> 0.9", organization: "coingaming"},
      {:moon_live_view, in_umbrella: true},
      {:phoenix, "~> 1.8"},
      {:phoenix_html, "~> 4.2"},
      {:phoenix_html_helpers, "~> 1.0"},
      {:phoenix_live_dashboard, "~> 0.8"},
      {:phoenix_live_reload, "~> 1.5", only: :dev},
      {:phoenix_live_view, "~> 1.1.0"},
      {:phoenix_storybook, "~> 0.9.2"},
      {:phoenix_view, "~> 2.0"},
      {:swoosh, "~> 1.18"},
      {:tailwind, "~> 0.3", runtime: Mix.env() == :dev},
      {:telemetry_metrics, "~> 1.1"},
      {:telemetry_poller, "~> 1.1"},
      {:tw_merge, "~> 0.1"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.

  defp aliases do
    [
      setup: ["deps.get", "assets.setup", "assets.build"],
      "assets.setup": ["tailwind.install --if-missing", "esbuild.install --if-missing"],
      "assets.build": [
        "tailwind moon_live_view_docs",
        "tailwind storybook",
        "esbuild moon_live_view_docs"
      ],
      "assets.deploy": [
        "tailwind moon_live_view_docs --minify",
        "esbuild moon_live_view_docs --minify",
        "tailwind storybook --minify",
        "phx.digest"
      ]
    ]
  end
end
