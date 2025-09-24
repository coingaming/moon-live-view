defmodule MoonLive.Input do
  use MoonLive.Component

  attr :id, :string, default: nil, doc: "Unique identifier for the input component"
  attr :size, :string, values: ~w"sm md lg xl", default: "md", doc: "Size of the input"
  attr :variant, :string, values: ~w"fill outline", default: "fill", doc: "The variant of the input"
  attr :error, :boolean, default: false, doc: "If true, the input is in error state"
  attr :disabled, :boolean, default: false, doc: "If true, the input is disabled"
  attr :placeholder, :string, default: "", doc: "Placeholder for the input"

  attr :type, :string,
    default: "text",
    values: ~w(text email password search tel url number date datetime-local color hidden ),
    doc: "Type of the input"

  attr :class, :string, default: "", doc: "Additional CSS classes for the input"
  attr :rest, :global, doc: "Additional HTML attributes for the input"

  slot :label, doc: "Label for the input"
  slot :hint, doc: "Hint for the input"

  def input(assigns) do
    attrs = assigns_to_attributes(assigns, [:hint])
    assigns = assigns |> assign(attrs: attrs)

    ~H"""
    <%= if (@label != [] || @hint != []) && @type != "hidden" do %>
      <div class="moon-form-group">
        <.input_field {@attrs} />
        <p :if={@hint != []} class="moon-form-hint">{render_slot(@hint)}</p>
      </div>
    <% else %>
      <.input_field {@attrs} />
    <% end %>
    """
  end

  attr :id, :string, default: nil, doc: "Unique identifier for the input component"
  attr :size, :string, values: ~w"sm md lg xl", default: "md", doc: "Size of the input"
  attr :variant, :string, values: ~w"fill outline", default: "fill", doc: "The variant of the input"
  attr :error, :boolean, default: false, doc: "If true, the input is in error state"
  attr :disabled, :boolean, default: false, doc: "If true, the input is disabled"
  attr :placeholder, :string, default: "", doc: "Placeholder for the input"

  attr :type, :string,
    default: "text",
    values: ~w(text email password search tel url number date datetime-local color hidden ),
    doc: "Type of the input"

  attr :class, :string, default: "", doc: "Additional CSS classes for the input"
  attr :rest, :global, doc: "Additional HTML attributes for the input"

  slot :label, doc: "Label for the input"

  defp input_field(assigns) do
    ~H"""
    <div class="moon-input-wrapper">
      <label :if={@label != []} for={@id}>{render_slot(@label)}</label>
      <input
        id={@id}
        type={@type}
        class={join(["moon-input", get_size(@size), get_variant(@variant), get_error(@error), @class])}
        placeholder={@placeholder}
        disabled={@disabled}
        {@rest}
      />
    </div>
    """
  end

  def get_size("md"), do: ""
  def get_size(size), do: "moon-input-#{size}"

  def get_error(false), do: ""
  def get_error(true), do: "moon-input-error"

  defp get_variant("fill"), do: ""
  defp get_variant(variant), do: "moon-input-#{variant}"
end
