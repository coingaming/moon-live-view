defmodule MoonLive.List do
  use MoonLive.Component

  attr :size, :string, values: ~w(sm md lg), default: "md", doc: "Size of the List"

  attr :class, :string, default: "", doc: "CSS class for the List"
  attr :rest, :global, doc: "Additional HTML attributes for the List"

  slot :inner_block

  def list(assigns) do
    ~H"""
    <ul class={merge(["moon-list", get_size_class(@size), @class])} {@rest}>
      {render_slot(@inner_block)}
    </ul>
    """
  end

  attr :class, :string, default: "", doc: "CSS class for the List Item"
  attr :rest, :global, doc: "Additional HTML attributes for the List Item"

  slot :inner_block, required: true, doc: "Inner content for the List Item"

  slot :meta, doc: "Meta content of the List Item" do
    attr :class, :string, doc: "CSS class for the meta content"
  end

  def list_item(assigns) do
    ~H"""
    <li class={join(["moon-list-item", @class])} {@rest}>
      {render_slot(@inner_block)}
      <div :if={@meta != []} class="moon-list-item-meta">
        {render_slot(@meta)}
      </div>
    </li>
    """
  end

  defp get_size_class("md"), do: nil
  defp get_size_class(size), do: "moon-list-#{size}"
end
