defmodule MoonLiveViewDocs.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start TwMerge cache
      TwMerge.Cache,
      MoonLiveViewDocsWeb.Telemetry,
      {DNSCluster,
       query: Application.get_env(:moon_live_view_docs, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: MoonLiveViewDocs.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: MoonLiveViewDocs.Finch},
      # Start a worker by calling: MoonLiveViewDocs.Worker.start_link(arg)
      # {MoonLiveViewDocs.Worker, arg},
      # Start to serve requests, typically the last entry
      MoonLiveViewDocsWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: MoonLiveViewDocs.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    MoonLiveViewDocsWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
