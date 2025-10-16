# Create a simple release configuration for hot upgrades
use Mix.Releases.Config,
    default_release: :default,
    default_environment: Mix.env()

environment :dev do
  set dev_mode: true
  set include_erts: false
  set cookie: :dev
end

environment :prod do
  set include_erts: true
  set include_src: false
  set cookie: System.get_env("ERLANG_COOKIE") || :moon_live_view_docs
  set vm_args: "rel/vm.args"
end

release :moon_live_view_docs do
  set version: current_version(:moon_live_view_docs)
  set applications: [
    :runtime_tools,
    moon_live_view_docs: :permanent
  ]
end
