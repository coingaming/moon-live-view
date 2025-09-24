defmodule MoonLive.Tag do
  use MoonLive.Component

  attr :variant, :string, values: ~w"fill ghost outline soft", default: "fill", doc: "Variant of the tag"
  attr :size, :string, values: ~w"2xs xs", default: "xs", doc: "Size of the tag"

  attr :context, :string,
    values: ~w"brand neutral positive negative caution info",
    default: "brand",
    doc: "The context of the tag"

  attr :class, :string, default: "", doc: "Additional CSS classes for the tag"
  attr :rest, :global, doc: "Additional HTML attributes for the tag"

  slot :inner_block, doc: "Inner block of the tag"
  slot :start_content, doc: "Content to be displayed at the start of the tag"
  slot :end_content, doc: "Content to be displayed at the end of the tag"

  def tag(assigns) do
    ~H"""
    <div class={join(["moon-tag", get_variant(@variant), get_size(@size), get_context(@context), @class])} {@rest}>
      {render_slot(@start_content)}
      {render_slot(@inner_block)}
      {render_slot(@end_content)}
    </div>
    """
  end

  def get_size("xs"), do: ""
  def get_size(size), do: "moon-tag-#{size}"

  def get_variant("fill"), do: ""
  def get_variant(variant), do: "moon-tag-#{variant}"

  defp get_context("brand"), do: ""
  defp get_context(context), do: "moon-tag-#{context}"
end
