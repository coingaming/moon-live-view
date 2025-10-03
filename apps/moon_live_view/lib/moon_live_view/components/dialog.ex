defmodule MoonLiveView.Dialog do
  use MoonLiveView.Component
  alias Phoenix.LiveView.JS

  attr :id, :string, default: nil, doc: "Unique identifier for the Dialog component."
  attr :has_close_button, :boolean, default: false, doc: "Whether the Dialog has a close button."
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
          <form :if={@has_close_button || @custom_close_icon != []} method="dialog" class="moon-dialog-close">
            <button class="moon-dialog-close">
              <%= if @custom_close_icon != [] do %>
                {render_slot(@custom_close_icon)}
              <% else %>
                <.component_icon name="close" />
              <% end %>
            </button>
          </form>
        </div>
        {render_slot(@inner_block)}
      </div>
      <form method="dialog" class="moon-backdrop">
        <button></button>
      </form>
    </dialog>
    """
  end

  def show_dialog(js \\ %JS{}, id) do
    js |> JS.dispatch("moon:dialog:open", to: "##{id}")
  end

  def hide_dialog(js \\ %JS{}, id) do
    js |> JS.dispatch("moon:dialog:close", to: "##{id}")
  end
end
