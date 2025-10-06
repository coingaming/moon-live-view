defmodule MoonLiveView.MixProject do
  use Mix.Project

  def project do
    [
      app: :moon_live_view,
      version: "1.0.0-beta.0",
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 1.17",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      package: package()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp package do
    [
      licenses: ["MIT"],
      links: %{
        "GitHub" => "https://github.com/coingaming/moon-live-view"
      },
      description: "Moon Design System written in phoenix_live_view",
      files: ~w(lib ../../.formatter.exs mix.exs README* CHANGELOG* priv assets)
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:phoenix, "~> 1.7"},
      {:phoenix_html, "~> 4.2"},
      {:phoenix_live_view, "~> 1.0"},
      {:jason, "~> 1.4"}
    ]
  end
end
