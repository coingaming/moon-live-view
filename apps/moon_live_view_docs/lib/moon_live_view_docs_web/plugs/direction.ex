defmodule MoonLiveViewDocsWeb.Plugs.Direction do
  @moduledoc "Moon Doc Plug Direction"

  import Plug.Conn

  @cookie_key "moon-dir"

  def init(default), do: default

  def call(conn, _opts) do
    dir = conn.cookies[@cookie_key] || "ltr"
    put_session(conn, :dir, dir)
  end
end
