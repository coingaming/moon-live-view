defmodule MoonLiveView.Radio do
  use MoonLiveView.Component

  attr :id, :string, default: nil, doc: "Unique identifier for the radio button component"

  attr :checked, :boolean, default: false, doc: "Current checked state of the radio button"
  attr :disabled, :boolean, default: false, doc: "Indicates whether the radio is disabled"

  attr :class, :string, default: "", doc: "Additional CSS classes for the radio button"
  attr :rest, :global, doc: "Additional HTML attributes for the radio button"

  slot :label, doc: "Label for the radio button"

  def radio(assigns) do
    attrs = assigns_to_attributes(assigns, [:label])
    assigns = assigns |> assign(attrs: attrs)

    ~H"""
    <%= if @label != [] do %>
      <div class={
        join([
          "moon-radio-wrapper",
          @class
        ])
      }>
        <.radio_button_input {@attrs} />
        <label for={@id}>{render_slot(@label)}</label>
      </div>
    <% else %>
      <.radio_button_input {@attrs} />
    <% end %>
    """
  end

  attr :id, :string, default: nil, doc: "Unique identifier for the radio button component"
  attr :checked, :boolean, default: false, doc: "Current checked state of the radio button"
  attr :disabled, :boolean, default: false, doc: "Indicates whether the radio is disabled"

  attr :class, :string, default: "", doc: "Additional CSS classes for the radio button"
  attr :rest, :global, doc: "Additional HTML attributes for the radio button"

  def radio_button_input(assigns) do
    ~H"""
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
    """
  end
end
