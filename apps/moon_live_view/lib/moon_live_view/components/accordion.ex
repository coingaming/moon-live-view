defmodule MoonLive.Accordion do
  use MoonLive.Component

  attr(:size, :string, values: ~w"sm md lg xl", default: "md", doc: "Size of the Accordion")

  attr(:variant, :string,
    values: ~w"fill ghost outline",
    default: "fill",
    doc: "Variant of the Accordion"
  )

  attr(:class, :string, default: "", doc: "Additional CSS classes for the Accordion")
  attr(:rest, :global, doc: "Additional HTML attributes for the Accordion")

  def accordion(assigns) do
    ~H"""
    <div class={join(["moon-accordion", get_size(@size), get_variant(@variant), @class])} {@rest}>
      {render_slot(@inner_block)}
    </div>
    """
  end

  attr(:class, :string, default: "", doc: "Additional CSS classes for the Accordion")
  attr(:rest, :global, doc: "Additional HTML attributes for the Accordion")

  def accordion_item(assigns) do
    ~H"""
    <details class={join(["moon-accordion-item", @class])} {@rest}>
      {render_slot(@inner_block)}
    </details>
    """
  end

  slot :meta, doc: "Meta content of the Accordion item header" do
    attr(:class, :string, doc: "Additional classes for the meta content.")
  end

  slot :inner_block, doc: "Inner block of the Accordion item header"

  def accordion_item_header(assigns) do
    ~H"""
    <summary class="moon-accordion-item-header">
      {render_slot(@inner_block)}
      <div class="moon-accordion-item-meta">
        {render_slot(@meta)}
      </div>
    </summary>
    """
  end

  attr :class, :string, default: "", doc: "CSS class for the Accordion item toggle"
  attr :rest, :global, doc: "Additional HTML attributes for the Accordion item toggle"

  slot :inner_block, doc: "Inner block of the Accordion item toggle"

  def accordion_item_toggle(assigns) do
    ~H"""
    <button class={join(["moon-accordion-item-toggle", @class])} {@rest}>
      <%= if @inner_block != [] do %>
        {render_slot(@inner_block)}
      <% else %>
        <.component_icon name="chevron-down" />
      <% end %>
    </button>
    """
  end

  slot :inner_block, doc: "Inner block of the Accordion item header"

  def accordion_item_content(assigns) do
    ~H"""
    <div class="moon-accordion-item-content">
      {render_slot(@inner_block)}
    </div>
    """
  end

  def get_size("md"), do: ""
  def get_size(size), do: "moon-accordion-#{size}"

  def get_variant("fill"), do: ""
  def get_variant(variant), do: "moon-accordion-#{variant}"
end
