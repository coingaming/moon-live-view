defmodule MoonLiveView.Badge do
  use MoonLiveView.Component

  attr :variant, :string, values: ~w"fill soft outline", default: "fill", doc: "The variant of the Badge"

  attr :context, :string,
    values: ~w"brand neutral positive negative caution info",
    default: "brand",
    doc: "The context of the Badge"

  attr :class, :string, default: nil, doc: "Additional styles for the Badge"
  attr :rest, :global, doc: "Additional attributes for the Badge"

  slot :inner_block, doc: "Badge's Inner content"

  def badge(assigns) do
    ~H"""
    <div class={join(["moon-badge", get_variant(@variant), get_context(@context), @class])} {@rest}>
      {render_slot(@inner_block)}
    </div>
    """
  end

  defp get_variant("fill"), do: ""
  defp get_variant(variant), do: "moon-badge-#{variant}"

  defp get_context("brand"), do: ""
  defp get_context(context), do: "moon-badge-#{context}"
end
