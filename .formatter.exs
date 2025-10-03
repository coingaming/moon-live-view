# Used by "mix format"
[
  import_deps: [:phoenix],
  plugins: [Phoenix.LiveView.HTMLFormatter],
  inputs: [
    "{mix,.formatter}.exs",
    "apps/**/*.{ex,exs,heex}"
  ],
  subdirectories: ["apps/*"],
  line_length: 120
]
