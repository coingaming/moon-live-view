defmodule MoonLive.Pagination do
  use MoonLive.Component
  alias Phoenix.LiveView.JS

  import MoonLive.{IconButton, ComponentIcon}

  @default_base_param "page"

  attr :id, :string, doc: "Id for the Pagination.", required: true
  attr :total_steps, :integer, default: 1, doc: "Number of steps in the Pagination"
  attr :has_controls, :boolean, default: false, doc: "Defines whether the Pagination has arrows or not."
  attr :active_item, :integer, default: nil, doc: "Active item in the Pagination."
  attr :base_param, :string, default: @default_base_param, doc: "Base parameter name for pagination"

  attr :class, :string, default: "", doc: "Additional CSS classes for the Pagination "
  attr :rest, :global, doc: "Additional HTML attributes for the Pagination."

  slot :inner_block, doc: "Pagination inner block"

  def pagination(assigns) do
    ~H"""
    <ul
      id={@id}
      class={join(["moon-pagination", @class])}
      role="pagination"
      phx-hook="PaginationHook"
      data-active-item={@active_item}
      data-total-steps={@total_steps}
      {@rest}
    >
      <.icon_button
        :if={@has_controls}
        variant="soft"
        size="sm"
        phx-click={on_arrow_click(@id, @base_param, :prev)}
        data-arrow-control="prev"
      >
        <.component_icon name="chevron-left" />
      </.icon_button>
      <li
        :for={item <- 1..@total_steps}
        class={join(["moon-pagination-item", is_active_item(item, @active_item)])}
        phx-click={on_item_click(@id, item, @base_param)}
        data-item={item}
        role="button"
      >
        {item}
      </li>
      <.icon_button
        :if={@has_controls}
        variant="soft"
        size="sm"
        phx-click={on_arrow_click(@id, @base_param, :next)}
        data-arrow-control="next"
      >
        <.component_icon name="chevron-right" />
      </.icon_button>
    </ul>
    """
  end

  defp is_active_item(item, active_item) do
    if item == active_item, do: "moon-pagination-item-active", else: ""
  end

  defp on_item_click(js \\ %JS{}, id, item, base_param) do
    js
    |> JS.remove_class("moon-pagination-item-active", to: "##{id} .moon-pagination-item-active")
    |> JS.add_class("moon-pagination-item-active")
    |> JS.set_attribute({"data-active-item", item}, to: "##{id}")
    |> JS.patch("?#{base_param}=#{item}")
  end

  def on_arrow_click(js \\ %JS{}, id, base_param, direction) do
    js
    |> JS.dispatch("moon:pagination:navigate", to: "##{id}", detail: %{direction: direction, base_param: base_param})
  end
end
