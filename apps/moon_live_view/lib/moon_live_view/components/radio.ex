defmodule MoonLiveView.Radio do
  use MoonLiveView.Component

  attr :id, :string, default: nil, doc: "Unique identifier for the radio button component"

  attr :checked, :boolean, default: false, doc: "Current checked state of the radio button"
  attr :disabled, :boolean, default: false, doc: "Indicates whether the radio is disabled"

  attr :class, :string, default: "", doc: "Additional CSS classes for the radio button"
  attr :rest, :global, doc: "Additional HTML attributes for the radio button"

  slot :label, doc: "Label for the radio button"

  def radio(assigns) do
    ~H"""
    <label>
      <input
        id={@id}
        type="radio"
        class={
          join([
            "moon-radio",
            @class
          ])
        }
        checked={@checked}
        disabled={@disabled}
        {@rest}
      />
      <span :if={@label != []}>
        {render_slot(@label)}
      </span>
    </label>
    """
  end

  attr :class, :string, default: "", doc: "Additional CSS classes for the radio group"
  attr :rest, :global, doc: "Additional HTML attributes for the radio group"

  slot :inner_block, doc: "Inner block of the radio group"

  def radio_group(assigns) do
    ~H"""
    <div class={join(["moon-radio-group", @class])} {@rest}>
      {render_slot(@inner_block)}
    </div>
    """
  end
end
