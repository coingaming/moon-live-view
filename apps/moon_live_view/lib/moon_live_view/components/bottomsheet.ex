defmodule MoonLiveView.BottomSheet do
  use MoonLiveView.Component
  alias Phoenix.LiveView.JS

  attr :id, :string, doc: "Unique identifier for the alert component. Required for the close button to work if present"
  attr :has_handle, :boolean, default: false, doc: "Whether the bottom sheet has a handle for dragging."
  attr :has_close_button, :boolean, default: false, doc: "Whether the bottom sheet has a close button."
  attr :class, :string, default: "", doc: "Additional classes to add to the component."
  slot :header, doc: "Title content of the bottom sheet."
  slot :custom_close_icon, doc: "Custom close icon for the bottom sheet."
  slot :inner_block, doc: "Inner content of the bottom sheet."
  attr :rest, :global, doc: "Additional attributes to add to the bottom sheet component."

  def bottom_sheet(assigns) do
    ~H"""
    <dialog id={@id} class={merge(["moon-bottom-sheet", @class])} phx-hook="BottomSheetHook">
      <div class="moon-bottom-sheet-box">
        <div :if={@has_handle} class="moon-bottom-sheet-handle"></div>

        <div :if={@header != []} class="moon-bottom-sheet-header">
          {render_slot(@header)}

          <form :if={@has_close_button || @custom_close_icon != []} method="dialog" class="moon-bottom-sheet-close">
            <button class="moon-bottom-sheet-close">
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

  def show_bottom_sheet(js \\ %JS{}, id) do
    js |> JS.dispatch("moon:bottomSheet:open", to: "##{id}")
  end

  def hide_bottom_sheet(js \\ %JS{}, id) do
    js |> JS.dispatch("moon:bottomSheet:close", to: "##{id}")
  end
end
