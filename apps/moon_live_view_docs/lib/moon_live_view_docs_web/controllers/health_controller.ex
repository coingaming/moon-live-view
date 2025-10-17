defmodule MoonLiveViewDocsWeb.HealthController do
  use MoonLiveViewDocsWeb, :controller

  def index(conn, _params) do
    # Add any health checks here (database, external services, etc.)

    conn
    |> put_status(:ok)
    |> json(%{
      status: "ok",
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601(),
      version: Application.spec(:moon_live_view_docs, :vsn) |> to_string(),
      uptime: :erlang.statistics(:wall_clock) |> elem(0)
    })
  end
end
