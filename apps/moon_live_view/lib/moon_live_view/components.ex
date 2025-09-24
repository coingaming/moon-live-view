defmodule MoonLive.Components do
  use MoonLive.Component

  attr :for, :string, default: nil, doc: "Label 'for' attribute value"
  attr :class, :string, default: "", doc: "Additional styles for the label"
  slot :inner_block, required: true, doc: "Label content"

  def moon_label(assigns) do
    ~H"""
    <label for={@for} class={@class}>
      {render_slot(@inner_block)}
    </label>
    """
  end

  attr :class, :string, default: "", doc: "Additional styles for the hint"
  slot :inner_block, required: true, doc: "Hint message content"

  def moon_hint(assigns) do
    ~H"""
    <p class={join(["moon-form-hint", @class])}>
      {render_slot(@inner_block)}
    </p>
    """
  end
end
