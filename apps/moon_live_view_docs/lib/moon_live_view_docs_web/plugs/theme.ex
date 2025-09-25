defmodule MoonLiveViewDocsWeb.Plugs.Theme do
  @moduledoc "Moon Doc Plug Theme"

  import Plug.Conn

  @cookie_key "moon-theme"

  def init(default), do: default

  def call(conn, _opts) do
    theme = conn.cookies[@cookie_key] || "light"
    put_session(conn, :theme, theme)
  end
end
