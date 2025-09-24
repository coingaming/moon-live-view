defmodule MoonLiveView.Avatar do
  use MoonLiveView.Component

  attr :class, :string, default: nil, doc: "Additional classes to add to the component."

  attr :size, :string,
    values: ~w(xs sm md lg xl 2xl),
    default: "md",
    doc: "Size of the avatar."

  attr :variant, :string, values: ~w"fill soft", default: "fill", doc: "Variant of the avatar."
  attr :rest, :global, doc: "Additional attributes to add to the avatar component."

  slot :inner_block, doc: "Inner content"

  def avatar(assigns) do
    ~H"""
    <div class={["moon-avatar", get_size(@size), get_variant(@variant), @class] |> join()} {@rest}>
      <%= if @inner_block != [] do %>
        {render_slot(@inner_block)}
      <% else %>
        <.component_icon name="user" />
      <% end %>
    </div>
    """
  end

  def get_size("md"), do: ""
  def get_size(size), do: "moon-avatar-#{size}"

  def get_variant("fill"), do: ""
  def get_variant(variant), do: "moon-avatar-#{variant}"
end
