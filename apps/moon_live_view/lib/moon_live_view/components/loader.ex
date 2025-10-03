defmodule MoonLiveView.Loader do
  use MoonLiveView.Component

  attr :class, :string, default: "", doc: "Additional CSS classes for the loader"
  attr :size, :string, values: ~w"2xs xs sm md lg", default: "md", doc: "Size of the loader"
  attr :rest, :global, doc: "Additional HTML attributes for the loader component"

  def loader(assigns) do
    ~H"""
    <div class={join(["moon-loader", get_size(@size), @class])} {@rest}></div>
    """
  end

  def get_size("md"), do: ""
  def get_size(size), do: "moon-loader-#{size}"
end
