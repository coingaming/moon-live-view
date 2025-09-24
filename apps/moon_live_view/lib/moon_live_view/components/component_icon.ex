defmodule MoonLiveView.ComponentIcon do
  use Phoenix.Component

  attr(:name, :string, required: true)
  attr(:class, :any, default: nil)
  attr(:rest, :global)

  def component_icon(assigns) do
    ~H"""
    <svg width="20" height="20" viewBox="0 0 20 20" class={@class} {@rest}>
      <use href={"/moon_live/icons/#{@name}.svg##{@name}"} />
    </svg>
    """
  end
end
