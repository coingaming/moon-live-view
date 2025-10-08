defmodule MoonLiveView.Dialog do
  use MoonLiveView.Component
  alias Phoenix.LiveView.JS

  attr :id, :string, default: nil, doc: "Unique identifier for the Dialog component."
  attr :class, :string, default: "", doc: "Additional CSS classes for the Dialog"
  attr :rest, :global, doc: "Additional HTML attributes for the Dialog"

  slot :inner_block, doc: "Inner block of the Dialog"
  slot :header, doc: "Header of the Dialog"
  slot :custom_close_icon, doc: "Custom close icon for the Dialog."

  def dialog(assigns) do
    ~H"""
    <dialog id={@id} class={join(["moon-dialog", @class])} {@rest} phx-hook="DialogHook">
      <div id={"#{@id}-dialog-box"} class="moon-dialog-box">
        <div :if={@header != []} class="moon-dialog-header">
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

  attr :id, :string, default: nil, doc: "ID of the dialog to close (optional)"

  def dialog_close(assigns) do
    ~H"""
    <button
      class="moon-dialog-close"
      phx-click={JS.dispatch("moon:dialog:close", to: @id && "##{@id}")}
      type="button"
    >
      <.component_icon name="close" />
    </button>
    """
  end

  def show_dialog(js \\ %JS{}, id) do
    js |> JS.dispatch("moon:dialog:open", to: "##{id}")
  end

  def hide_dialog(js \\ %JS{}, id) do
    js |> JS.dispatch("moon:dialog:close", to: "##{id}")
  end
end
