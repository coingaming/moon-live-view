defmodule MoonLiveView.Chip do
  use MoonLiveView.Component

  attr :variant, :string, values: ~w"fill soft outline", default: "fill", doc: "Variant of the Chip"
  attr :size, :string, values: ~w"sm md", default: "md", doc: "Size of the Chip"
  attr :is_active, :boolean, default: false, doc: "If true, the Chip is selected"

  attr :class, :string, default: "", doc: "Additional CSS classes for the Chip"
  attr :rest, :global, doc: "Additional HTML attributes for the Chip"

  slot :inner_block, doc: "Inner block of the Chip"

  def chip(assigns) do
    ~H"""
    <button
      class={
        join([
          "moon-chip",
          get_size(@size),
          get_variant(@variant),
          get_is_active(@is_active),
          @class
        ])
      }
      {@rest}
    >
      {render_slot(@inner_block)}
    </button>
    """
  end

  def get_size("md"), do: ""
  def get_size("sm"), do: "moon-chip-sm"

  def get_variant("fill"), do: ""
  def get_variant(variant), do: "moon-chip-#{variant}"

  def get_is_active(false), do: ""
  def get_is_active(true), do: "moon-chip-active"
end
