defmodule MoonLiveViewUmbrella.MixProject do
  use Mix.Project

  def project do
    [
      apps_path: "apps",
      version: "0.1.0",
      elixir: "~> 1.17",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Dependencies listed here are available only for this
  # project and cannot be accessed from applications inside
  # the apps folder.
  #
  # Run "mix help deps" for examples and options.
  defp deps do
    [
      {:bandit, "~> 1.6"},
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
      {:dns_cluster, "~> 0.2"},
      {:earmark, "~> 1.4"},
      {:esbuild, "~> 0.9", runtime: Mix.env() == :dev},
      {:ex_doc, "~> 0.37", only: [:dev, :test], runtime: false},
      {:finch, "~> 0.19"},
      {:gettext, "~> 0.26"},
      {:jason, "~> 1.4"},
      {:makeup, "~> 1.2"},
      {:makeup_eex, "~> 2.0"},
      {:makeup_elixir, "~> 1.0"},
      {:makeup_html, "~> 0.2.0"},
      {:moon_assets, "~> 0.9", organization: "coingaming"},
      {:phoenix, "~> 1.8"},
      {:phoenix_html, "~> 4.2"},
      {:phoenix_html_helpers, "~> 1.0"},
      {:phoenix_live_dashboard, "~> 0.8"},
      {:phoenix_live_reload, "~> 1.5", only: :dev},
      {:phoenix_live_view, "~> 1.1.0"},
      {:phoenix_storybook, "~> 0.9.2"},
      {:phoenix_view, "~> 2.0"},
      {:plug_cowboy, "~> 2.7", only: [:test]},
      {:swoosh, "~> 1.18"},
      {:tailwind, "~> 0.4", runtime: Mix.env() == :dev},
      {:telemetry_metrics, "~> 1.1"},
      {:telemetry_poller, "~> 1.1"},
      {:tw_merge, "~> 0.1"}
    ]
  end
end
