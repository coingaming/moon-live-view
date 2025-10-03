defmodule MoonLiveView.Switch do
  use MoonLiveView.Component

  attr :id, :string, default: nil, doc: "Unique identifier for the switch component"
  attr :class, :string, default: "", doc: "Additional CSS classes for the switch"
  attr :rest, :global, doc: "Additional HTML attributes for the switch"
  attr :checked, :boolean, default: false, doc: "If true, the switch is checked"
  attr :disabled, :boolean, default: false, doc: "If true, the switch is disabled"
  attr :size, :string, values: ~w"2xs xs sm", default: "sm", doc: "Size of the switch"

  def switch(assigns) do
    ~H"""
    <input
      id={@id}
      type="checkbox"
      class={join(["moon-switch", get_size(@size), @class])}
      disabled={@disabled}
      checked={@checked}
      {@rest}
    />
    """
  end

  def get_size("sm"), do: ""
  def get_size(size), do: "moon-switch-#{size}"
end
