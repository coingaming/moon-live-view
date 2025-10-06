# Used by "mix format"
[
  import_deps: [:phoenix],
  plugins: [Phoenix.LiveView.HTMLFormatter],
  inputs: [
    "{mix,.formatter}.exs",
    "apps/**/*.{heex,ex,exs}"
  ],
  subdirectories: ["apps/*"],
  line_length: 120
]
