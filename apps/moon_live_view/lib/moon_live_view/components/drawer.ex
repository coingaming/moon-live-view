defmodule MoonLiveView.Drawer do
  use MoonLiveView.Component
  alias Phoenix.LiveView.JS

  attr :id, :string, default: nil, doc: "Unique identifier for the Drawer component"
  attr :has_close_button, :boolean, default: false, doc: "Whether the Drawer has a close button."
  attr :position, :string, values: ~w"start end", default: "end", doc: "Position of the Drawer"
  attr :class, :string, default: "", doc: "Additional CSS classes for the Drawer"
  attr :rest, :global, doc: "Additional HTML attributes for the Drawer"

  slot :inner_block, doc: "Inner block of the Drawer"
  slot :header, doc: "Header of the Drawer"
  slot :custom_close_icon, doc: "Custom close icon for the Drawer."

  def drawer(assigns) do
    ~H"""
    <dialog id={@id} class={join(["moon-drawer", get_position(@position), @class])} {@rest} phx-hook="DrawerHook">
      <div id={"#{@id}-modal-box"} class="moon-drawer-box">
        <div :if={@header != []} class="moon-drawer-header">
          {render_slot(@header)}
        </div>
        {render_slot(@inner_block)}
      </div>
      <form method="dialog" class="moon-backdrop">
        <button></button>
      </form>
    </dialog>
    """
  end

  attr :id, :string, default: nil, doc: "ID of the drawer to close (optional)"

  def drawer_close(assigns) do
    ~H"""
    <button
      class="moon-drawer-close"
      phx-click={JS.dispatch("moon:drawer:close", to: @id && "##{@id}")}
      type="button"
    >
      <.component_icon name="close" />
    </button>
    """
  end

  def show_drawer(js \\ %JS{}, id) do
    js |> JS.dispatch("moon:drawer:open", to: "##{id}")
  end

  def hide_drawer(js \\ %JS{}, id) do
    js |> JS.dispatch("moon:drawer:close", to: "##{id}")
  end

  defp get_position("end"), do: ""
  defp get_position(position), do: "moon-drawer-#{position}"
end
