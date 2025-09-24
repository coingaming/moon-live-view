defmodule MoonLiveView.Dropdown do
  use MoonLiveView.Component
  import MoonLiveView.Button

  attr :class, :string, default: "", doc: "Additional CSS classes for the dropdown"
  attr :rest, :global, doc: "Additional HTML attributes for the dropdown"

  slot :trigger, doc: "Content of the dropdown trigger"
  slot :inner_block, doc: "Inner block of the dropdown"

  def dropdown(assigns) do
    ~H"""
    <div class={merge(["moon-dropdown", @class])} {@rest}>
      <.button tabindex="0">
        {render_slot(@trigger)}
      </.button>
      <div tabindex="0" class="moon-dropdown-content">
        {render_slot(@inner_block)}
      </div>
    </div>
    """
  end
end
