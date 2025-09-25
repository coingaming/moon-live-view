defmodule MoonLiveViewDocsWeb.PageController do
  use MoonLiveViewDocsWeb, :controller
  use MoonLiveViewDocs.Code

  use_documentation()

  def home(conn, _) do
    render(conn, :home)
  end

  def switch(conn, _) do
    render(conn, :switch)
  end
end
