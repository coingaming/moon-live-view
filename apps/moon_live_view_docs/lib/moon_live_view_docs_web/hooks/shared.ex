defmodule MoonLiveViewDocsWeb.Hooks.Shared do
  @moduledoc """
    Global Hook to handle the direction / theme
  """

  use Phoenix.LiveView

  def on_mount(:default, _params, session, socket) do
    if connected?(socket) do
      conn_params = get_connect_params(socket)

      {:cont,
       socket
       |> assign(
         dir: conn_params["dir"] || "ltr",
         theme: conn_params["theme"] || "light"
       )
       |> attach_hook(:generic_hook, :handle_event, &handle_generic_event/3)}
    else
      {:cont,
       socket
       |> assign(
         dir: session["dir"] || "ltr",
         theme: session["theme"] || "light"
       )}
    end
  end

  def handle_generic_event("set_dir_layout", %{"dir" => "rtl"}, socket) do
    socket =
      socket
      |> push_event("set_dir_layout", %{"dir" => "rtl"})

    {:halt, socket}
  end

  def handle_generic_event("set_dir_layout", %{"dir" => "ltr"}, socket) do
    socket =
      socket
      |> push_event("set_dir_layout", %{"dir" => "ltr"})

    {:halt, socket}
  end

  def handle_generic_event("set_theme", %{"theme" => "dark"}, socket) do
    socket =
      socket
      |> push_event("set_theme", %{"theme" => "dark"})

    {:halt, socket}
  end

  def handle_generic_event("set_theme", %{"theme" => "light"}, socket) do
    socket =
      socket
      |> push_event("set_theme", %{"theme" => "light"})

    {:halt, socket}
  end

  def handle_generic_event(_, _, socket), do: {:cont, socket}
end
