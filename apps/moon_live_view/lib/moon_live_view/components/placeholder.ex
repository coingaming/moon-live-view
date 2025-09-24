defmodule MoonLive.Placeholder do
  use MoonLive.Component

  attr :class, :string, default: "", doc: "Additional CSS classes for the placeholder"
  attr :rest, :global, doc: "Additional HTML attributes for the placeholder"

  def placeholder(assigns) do
    ~H"""
    <div class={join(["moon-placeholder", @class])} {@rest}></div>
    """
  end
end
