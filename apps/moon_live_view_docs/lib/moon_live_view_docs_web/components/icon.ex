defmodule MoonLiveViewDocs.Icon do
  use Phoenix.Component

  import MoonLiveView.Utils

  attr :name, :string, required: true
  attr :class, :string, default: nil
  attr :rest, :global

  def icon(assigns) do
    ~H"""
    <svg width="20" height="20" viewBox="0 0 20 20" class={join(["inline-block", @class])} {@rest}>
      <use href={"/moon_live_docs/icons/#{@name}.svg##{@name}"} />
    </svg>
    """
  end
end
