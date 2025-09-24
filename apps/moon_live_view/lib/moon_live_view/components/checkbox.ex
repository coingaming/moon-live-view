defmodule MoonLive.Checkbox do
  use MoonLive.Component

  attr :id, :string, default: nil, doc: "Unique identifier for the checkbox component"
  attr :checked, :boolean, default: false, doc: "Indicates whether the checkbox is checked"
  attr :disabled, :boolean, default: false, doc: "Indicates whether the checkbox is disabled"
  attr :indeterminate, :boolean, default: false, doc: "Indicates whether the checkbox is indeterminate"
  attr :class, :string, default: nil, doc: "Additional classes to add to the checkbox."
  attr :rest, :global, doc: "Additional attributes to add to the checkbox component."

  slot :label, doc: "Label for the checkbox"

  def checkbox(assigns) do
    attrs = assigns_to_attributes(assigns, [:label])
    assigns = assigns |> assign(attrs: attrs)

    ~H"""
    <%= if @label != [] do %>
      <div class="moon-checkbox-wrapper">
        <.checkbox_field {@attrs} />
        <label for={@id}>{render_slot(@label)}</label>
      </div>
    <% else %>
      <.checkbox_field {@attrs} />
    <% end %>
    """
  end

  attr :id, :string, default: nil, doc: "Unique identifier for the checkbox component"
  attr :checked, :boolean, default: false, doc: "Indicates whether the checkbox is checked"
  attr :disabled, :boolean, default: false, doc: "Indicates whether the checkbox is disabled"
  attr :indeterminate, :boolean, default: false, doc: "Indicates whether the checkbox is indeterminate"
  attr :class, :string, default: nil, doc: "Additional classes to add to the checkbox."
  attr :rest, :global, doc: "Additional attributes to add to the checkbox component."

  defp checkbox_field(assigns) do
    ~H"""
    <input
      id={@id}
      type="checkbox"
      class={join(["moon-checkbox", @class])}
      checked={@checked}
      disabled={@disabled}
      data-indeterminate={@indeterminate}
      phx-hook="CheckboxHook"
      {@rest}
    />
    """
  end
end
