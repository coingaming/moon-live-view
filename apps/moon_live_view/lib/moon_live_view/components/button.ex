defmodule MoonLiveView.Button do
  use MoonLiveView.Component

  attr :variant, :string, default: "fill", values: ~w"fill soft outline ghost", doc: "Variant of button"
  attr :size, :string, default: "md", values: ~w(xs sm md lg xl), doc: "Size of button"
  attr :is_full_width, :boolean, default: false, doc: "Whether the button should take the full width of its container."

  attr :context, :string,
    values: ~w"brand neutral positive negative caution info",
    default: "brand",
    doc: "The context of the button"

  attr :class, :string, default: nil, doc: "Additional classes to add to the component."
  attr :rest, :global, doc: "Additional attributes to add to the button component."

  slot :inner_block, doc: "Inner content"

  slot :start_content, doc: "Content to be rendered at the start of the button."
  slot :end_content, doc: "Content to be rendered at the end of the button."

  def button(assigns) do
    ~H"""
    <button
      class={
        join([
          "moon-button",
          get_size(@size),
          get_variant(@variant),
          get_context(@context),
          get_full_width(@is_full_width),
          @class
        ])
      }
      {@rest}
    >
      {render_slot(@start_content)}
      {render_slot(@inner_block)}
      {render_slot(@end_content)}
    </button>
    """
  end

  def get_variant("fill"), do: ""
  def get_variant(variant), do: "moon-button-#{variant}"

  def get_size("md"), do: ""
  def get_size(size), do: "moon-button-#{size}"

  defp get_context("brand"), do: ""
  defp get_context(context), do: "moon-button-#{context}"

  defp get_full_width(false), do: ""
  defp get_full_width(true), do: "moon-button-full-width"
end
