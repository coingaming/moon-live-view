defmodule MoonLive.Carousel do
  use MoonLive.Component
  alias Phoenix.LiveView.JS

  attr(:id, :string, doc: "ID for the Carousel. Required", required: true)
  attr(:active_item, :integer, default: 0, doc: "Index of the currently active slide")

  attr(:has_controls, :boolean,
    default: false,
    doc: "Defines whether or not the pagination has arrows"
  )

  attr(:class, :string, default: "", doc: "CSS class for the parent Carousel")
  attr(:rest, :global, doc: "Additional attributes for the Carousel")

  slot(:start_arrow) do
    attr(:class, :string, doc: "CSS class for the start arrow")
  end

  slot(:end_arrow) do
    attr(:class, :string, doc: "CSS class for the end arrow")
  end

  slot(:carousel_item) do
    attr(:class, :string, doc: "CSS class for each Carousel Item")
  end

  def carousel(assigns) do
    attrs = assigns_to_attributes(assigns, [:class])
    assigns = assign(assigns, attrs: attrs)

    ~H"""
    <.carousel_container id={@id} class={join(["moon-carousel", @class])} {@attrs} {@rest}>
      <.carousel_arrow_container :if={@has_controls} id={@id} direction="start" content={@start_arrow} />
      <.carousel_reel_container {@rest} id={@id} carousel_items={@carousel_item} />
      <.carousel_arrow_container :if={@has_controls} id={@id} direction="end" content={@end_arrow} />
    </.carousel_container>
    """
  end

  attr(:class, :string, default: "", doc: "CSS class for the Carousel")
  attr(:rest, :global, doc: "Additional attributes for the Carousel")
  attr(:id, :string, doc: "ID for the Carousel. Required", required: true)
  attr(:active_item, :integer, default: 0, doc: "Index of the currently active slide")
  slot(:inner_block, doc: "Inner block for the Carousel container")

  defp carousel_container(assigns) do
    ~H"""
    <div id={@id} data-active-slide-index={@active_item} phx-hook="CarouselHook" class={@class}>
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr(:id, :string, doc: "ID for the Carousel.", required: true)

  slot(:carousel_item, doc: "CSS class for each Carousel Item") do
    attr(:class, :string, doc: "CSS class for each Carousel Item")
  end

  def carousel_reel(assigns) do
    ~H"""
    <ul class="moon-carousel-reel">
      <li
        :for={{carousel_item, index} <- Enum.with_index(@carousel_item)}
        class={join(["moon-carousel-item", carousel_item[:class] || ""])}
        id={"#{@id}-slide-#{index}"}
      >
        {render_slot(carousel_item)}
      </li>
    </ul>
    """
  end

  attr(:id, :string, doc: "ID for the Carousel.", required: true)
  attr(:carousel_items, :list, default: [], doc: "CSS class for each Carousel Item")

  defp carousel_reel_container(assigns) do
    ~H"""
    <.carousel_reel id={@id}>
      <:carousel_item :for={carousel_item <- @carousel_items} class={carousel_item[:class] || ""}>
        {render_slot(carousel_item)}
      </:carousel_item>
    </.carousel_reel>
    """
  end

  attr(:id, :string, doc: "ID for the Carousel.", required: true)
  attr(:class, :string, default: "", doc: "CSS class for the Carousel Arrow")
  slot(:inner_block, doc: "Arrow content")

  attr(:direction, :string,
    values: ~w"start end",
    required: true,
    doc: "Direction of the arrow"
  )

  defp carousel_arrow(assigns) do
    ~H"""
    <button
      class={join(["moon-carousel-control", @class])}
      id={"#{@id}-arrow-#{@direction}"}
      phx-click={scroll(@id, @direction)}
    >
      <%= if @inner_block != [] do %>
        {render_slot(@inner_block)}
      <% else %>
        <.component_icon name={"chevron-#{get_arrow_icon_direction(@direction)}"} />
      <% end %>
    </button>
    """
  end

  attr(:id, :string, doc: "ID for the Carousel.", required: true)
  attr(:class, :string, default: "", doc: "CSS class for the Carousel Arrow")
  attr(:content, :list, default: [], doc: "Arrow content")

  attr(:direction, :string,
    values: ~w"start end",
    required: true,
    doc: "Direction of the arrow"
  )

  defp carousel_arrow_container(%{content: []} = assigns) do
    ~H"""
    <.carousel_arrow id={@id} class={@class} direction={@direction} />
    """
  end

  defp carousel_arrow_container(assigns) do
    ~H"""
    <.carousel_arrow id={@id} class={@class} direction={@direction}>
      {render_slot(@content)}
    </.carousel_arrow>
    """
  end

  def scroll(js \\ %JS{}, id, direction) do
    js |> JS.dispatch("moon:carousel:scroll_#{get_arrow_icon_direction(direction)}", to: "##{id}")
  end

  defp get_arrow_icon_direction(direction) do
    directions = %{"start" => "left", "end" => "right"}
    directions[direction]
  end
end
