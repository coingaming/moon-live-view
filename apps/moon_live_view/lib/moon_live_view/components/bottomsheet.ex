defmodule MoonLiveView.BottomSheet do
  use MoonLiveView.Component
  alias Phoenix.LiveView.JS

  attr :id, :string, doc: "Unique identifier for the bottom sheet component. Required for the close button to work if present"
  attr :has_handle, :boolean, default: false, doc: "Whether the bottom sheet has a handle for dragging."
  attr :class, :string, default: "", doc: "Additional classes to add to the component."
  slot :header, doc: "Title content of the bottom sheet."
  slot :inner_block, doc: "Inner content of the bottom sheet."
  attr :rest, :global, doc: "Additional attributes to add to the bottom sheet component."

  def bottom_sheet(assigns) do
    ~H"""
    <dialog id={@id} class={join(["moon-bottom-sheet", @class])} phx-hook="BottomSheetHook">
      <div class="moon-bottom-sheet-box">
        <div :if={@has_handle} class="moon-bottom-sheet-handle"></div>
        <div :if={@header != []} class="moon-bottom-sheet-header">
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

  attr :id, :string, default: nil, doc: "ID of the bottom sheet to close (optional)"

  def bottom_sheet_close(assigns) do
    ~H"""
    <button
      class="moon-bottom-sheet-close"
      phx-click={JS.dispatch("moon:bottomSheet:close", to: @id && "##{@id}")}
      type="button"
    >
      <.component_icon name="close" />
    </button>
    """
  end

  def show_bottom_sheet(js \\ %JS{}, id) do
    js |> JS.dispatch("moon:bottomSheet:open", to: "##{id}")
  end

  def hide_bottom_sheet(js \\ %JS{}, id) do
    js |> JS.dispatch("moon:bottomSheet:close", to: "##{id}")
  end
end
