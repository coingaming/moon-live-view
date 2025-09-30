defmodule MoonLiveView.Snackbar do
  use MoonLiveView.Component
  alias Phoenix.LiveView.JS

  @show_event "moon:snackbar:show"
  @hide_event_name "moon:snackbar:hide"

  attr :id, :string, default: nil, doc: "Unique identifier for the snackbar group component"
  attr :max_snackbars, :integer, default: 5, doc: "Maximum number of snackbars to display"
  attr :icon_path, :string, default: nil, doc: "Path to the icons directory"
  attr :class, :string, default: "", doc: "Additional CSS classes for the snackbar"
  attr :rest, :global, doc: "Additional HTML attributes for the snackbar"

  def snackbar_group(assigns) do
    ~H"""
    <div class="moon-snackbar-wrapper moon-snackbar-position-top-center">
      <div id={@id} class="moon-snackbar-group" data-max-snackbars={@max_snackbars} data-icon-path={@icon_path} phx-hook="SnackbarHook"></div>
    </div>
    """
  end

  def push_hide_event(socket, id) do
    push_custom_event(socket, @hide_event_name, id)
  end

  def push_show_event(socket, variant \\ "fill", context \\ "brand", message, id, opts \\ %{}) do
    socket |> push_custom_event(@show_event, id, build_details(variant, context, message, opts))
  end

  def show_snackbar(js \\ %JS{}, variant \\ "fill", context \\ "brand", message, id, opts \\ %{}) do
    js |> JS.dispatch(@show_event, to: "##{id}", detail: build_details(variant, context, message, opts))
  end

  defp build_details(variant, context, message, opts) do
    %{variant: variant, context: context, message: message, opts: opts}
  end
end
