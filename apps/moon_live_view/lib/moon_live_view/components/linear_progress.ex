defmodule MoonLive.LinearProgress do
  use MoonLive.Component

  attr :id, :string, default: nil, doc: "Unique identifier for the linear progress component"
  attr :size, :string, values: ~w"5xs 4xs 3xs 2xs", default: "2xs", doc: "Size of the linear progress"
  attr :value, :integer, default: 0, doc: "Current value of the linear progress"
  attr :class, :string, default: "", doc: "Additional CSS classes for the linear progress"
  attr :rest, :global, doc: "Additional HTML attributes for the linear progress"

  slot :label, doc: "Label for the linear progress"

  def linear_progress(assigns) do
    attrs = assigns_to_attributes(assigns, [:label])
    assigns = assigns |> assign(attrs: attrs)

    ~H"""
    <%= if @label != [] do %>
      <div class="moon-linear-progress-wrapper">
        <.progress_bar {@attrs} id={@id} />
        <label for={@id}>{render_slot(@label)}</label>
      </div>
    <% else %>
      <.progress_bar {@attrs} />
    <% end %>
    """
  end

  attr :id, :string, default: nil, doc: "Unique identifier for the linear progress component"
  attr :size, :string, values: ~w"2xs 3xs", default: "2xs", doc: "Size of the linear progress"
  attr :value, :integer, default: 0, doc: "Current value of the linear progress"
  attr :class, :string, default: "", doc: "Additional CSS classes for the linear progress"
  attr :rest, :global, doc: "Additional HTML attributes for the linear progress"

  def progress_bar(assigns) do
    ~H"""
    <progress
      class={
        join([
          "moon-linear-progress",
          get_size(@size),
          @class
        ])
      }
      value={@value}
      max="100"
      {@rest}
    >
    </progress>
    """
  end

  def get_size("2xs"), do: ""
  def get_size(size), do: "moon-linear-progress-#{size}"
end
