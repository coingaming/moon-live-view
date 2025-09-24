defmodule MoonLiveView.MixProject do
  use Mix.Project

  def project do
    [
      app: :moon_live_view,
      version: "0.1.0",
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
      extra_applications: [:logger],
      mod: {MoonLiveView.Application, []}
    ]
  end

  defp package do
    [
      organization: "coingaming",
      licenses: ["MIT"],
      links: %{
        "GitHub" => "https://github.com/coingaming/moon-live-view"
      },
      description: "Moon Design System written in phoenix_live_view",
      files: ~w(lib .formatter.exs mix.exs README* CHANGELOG* priv assets)
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"},
      # {:sibling_app_in_umbrella, in_umbrella: true}
    ]
  end
end
