defmodule MoonLiveView.Menu do
  use MoonLiveView.Component

  attr :size, :string, values: ~w"sm md lg", default: "md", doc: "Size of the Menu."

  attr :class, :string, default: "", doc: "Additional CSS classes for the Menu."
  attr :rest, :global, doc: "Additional HTML attributes for the Menu."

  slot :inner_block

  def menu(assigns) do
    ~H"""
    <ul
      class={
        join([
          "moon-menu",
          get_size(@size),
          @class
        ])
      }
      {@rest}
    >
      {render_slot(@inner_block)}
    </ul>
    """
  end

  attr :class, :string, default: "", doc: "CSS class for the Menu Item."
  attr :rest, :global, doc: "Additional HTML attributes for the Menu Item."

  slot :inner_block, doc: "Content to be displayed at the Menu Item."

  slot :meta, doc: "Meta content of the Menu Item." do
    attr :class, :string, doc: "CSS class for the meta content."
  end

  def menu_item(assigns) do
    ~H"""
    <li class={join(["moon-menu-item", @class])} {@rest}>
      {render_slot(@inner_block)}
      <div :if={@meta != []} class="moon-menu-item-meta">
        {render_slot(@meta)}
      </div>
    </li>
    """
  end

  def get_size("md"), do: ""
  def get_size(size), do: "moon-menu-#{size}"
end
