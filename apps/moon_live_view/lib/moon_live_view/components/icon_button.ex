defmodule MoonLive.IconButton do
  use MoonLive.Component

  attr :rounded, :boolean, default: false, doc: "Whether the button should be rounded or not"
  attr :disabled, :boolean, default: false, doc: "Disables the button, default is false"

  attr :class, :string, default: nil, doc: "Tailwind class for the button"
  attr :rest, :global, doc: "Additional global attributes for the button. form | name | value"

  attr :size, :string,
    values: ~w(xs sm md lg xl),
    default: "md",
    doc: "The button size style. xs | sm | md | lg | xl. default: md"

  attr :context, :string,
    values: ~w"brand neutral positive negative caution info",
    default: "brand",
    doc: "The context of the button"

  attr :variant, :string,
    values: ~w(fill soft outline ghost),
    default: "fill",
    doc: "The button variant style. fill | soft | outline | ghost. Default: fill"

  attr(:link_type, :string,
    default: "button",
    values: ["href", "patch", "navigate", "button"],
    doc: "Type of the link if the button is a link"
  )

  attr(:to, :string, default: nil, doc: "Link path")

  slot :inner_block, required: true, doc: "The content of the button. Any svg icon or icon components can be used here"

  def icon_button(assigns) do
    variant_class =
      Enum.join(
        [
          "moon-icon-button",
          get_size(assigns.size),
          get_variant(assigns.variant),
          get_context(assigns.context),
          get_rounded(assigns.rounded)
        ],
        " "
      )

    assigns = assign(assigns, :variant_class, variant_class)

    render_button_content(assigns)
  end

  defp render_button_content(%{link_type: "href"} = assigns) do
    ~H"""
    <.link class={merge([@variant_class, @class])} href={@to} {@rest}>
      {render_slot(@inner_block)}
    </.link>
    """
  end

  defp render_button_content(%{link_type: "navigate"} = assigns) do
    ~H"""
    <.link class={merge([@variant_class, @class])} navigate={@to} {@rest}>
      {render_slot(@inner_block)}
    </.link>
    """
  end

  defp render_button_content(%{link_type: "patch"} = assigns) do
    ~H"""
    <.link class={merge([@variant_class, @class])} patch={@to} {@rest}>
      {render_slot(@inner_block)}
    </.link>
    """
  end

  defp render_button_content(%{link_type: "button"} = assigns) do
    ~H"""
    <button class={merge([@variant_class, @class])} disabled={@disabled} {@rest}>
      {render_slot(@inner_block)}
    </button>
    """
  end

  defp get_variant("fill"), do: ""
  defp get_variant(variant), do: "moon-icon-button-#{variant}"

  defp get_size("md"), do: ""
  defp get_size(size), do: "moon-icon-button-#{size}"

  defp get_context("brand"), do: ""
  defp get_context(context), do: "moon-icon-button-#{context}"

  defp get_rounded(false), do: ""
  defp get_rounded(true), do: "moon-icon-button-rounded"
end
