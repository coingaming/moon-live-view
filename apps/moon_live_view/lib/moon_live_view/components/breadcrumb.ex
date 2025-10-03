defmodule MoonLiveView.Breadcrumb do
  use MoonLiveView.Component

  attr :class, :string, default: "", doc: "Additional CSS classes for the breadcrumb"
  attr :rest, :global, doc: "Additional HTML attributes for the breadcrumb"

  slot :breadcrumb_item, doc: "List of breadcrumb items" do
    attr :is_active, :boolean, doc: "If true, the breadcrumb item is active"
    attr :class, :string, doc: "Additional CSS classes for the single breadcrumb_item"
  end

  slot :divider, doc: "Breadcrumb divider"

  def breadcrumb(assigns) do
    ~H"""
    <ul class={join(["moon-breadcrumb", @class])} {@rest}>
      <.breadcrumb_item :for={breadcrumb_item <- @breadcrumb_item} breadcrumb_item={breadcrumb_item} divider={@divider}>
        {render_slot(breadcrumb_item)}
      </.breadcrumb_item>
    </ul>
    """
  end

  attr :is_active, :boolean, default: false, doc: "Whether the breadcrumb item is active or not"
  attr :breadcrumb_item, :list, default: [], doc: "Map containing attributes for the breadcrumb item"
  attr :divider, :list, default: [], doc: "Breadcrumb divider"

  slot :inner_block, doc: "Content of the breadcrumb item"

  defp breadcrumb_item(assigns) do
    ~H"""
    <li class={join(["moon-breadcrumb-item", get_is_active_class(@breadcrumb_item[:is_active]), @breadcrumb_item[:class]])}>
      {render_slot(@inner_block)}

      <%= if !@breadcrumb_item[:is_active] do %>
        <%!-- TBD: Provide this divider once css pseudo element is removed. --%>
        <%!-- <%= if @divider != [] do %>
          {render_slot(@divider)}
        <% else %>
          <.component_icon name="arrow-right" />
        <% end %> --%>
      <% end %>
    </li>
    """
  end

  defp get_is_active_class(true), do: "moon-breadcrumb-item-active"
  defp get_is_active_class(_), do: ""
end
