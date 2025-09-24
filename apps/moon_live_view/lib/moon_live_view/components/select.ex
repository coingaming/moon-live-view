defmodule MoonLive.Select do
  use MoonLive.Component

  attr :id, :string, default: nil, doc: "Unique identifier for the select component"
  attr :size, :string, values: ~w"sm md lg xl", default: "md", doc: "Size of the select"
  attr :variant, :string, values: ~w"fill outline", default: "fill", doc: "The variant of the select"
  attr :error, :boolean, default: false, doc: "Indicates whether the select has an error or not"
  attr :disabled, :boolean, default: false, doc: "Indicates whether the radio is disabled"

  attr :class, :string, default: "", doc: "Additional CSS classes for the select"
  attr :rest, :global, doc: "Additional HTML attributes for the select"

  slot :label, doc: "Label for the select"
  slot :hint, doc: "Hint for the select"
  slot :select_option, doc: "Options for the select"

  def select(assigns) do
    attrs = assigns_to_attributes(assigns, [:hint])
    assigns = assigns |> assign(attrs: attrs)

    ~H"""
    <%= if @label != [] || @hint != [] do %>
      <div class={merge(["moon-form-group", get_error(@error)])}>
        <.select_component {@attrs} />
        <p :if={@hint != []} class="moon-form-hint">{render_slot(@hint)}</p>
      </div>
    <% else %>
      <.select_component {@attrs} />
    <% end %>
    """
  end

  attr :id, :string, default: nil, doc: "Unique identifier for the select component"
  attr :size, :string, values: ~w"sm md lg xl", default: "md", doc: "Size of the select"
  attr :variant, :string, values: ~w"fill outline", default: "fill", doc: "The variant of the input"
  attr :error, :boolean, default: false, doc: "Indicates whether the select has an error or not"
  attr :disabled, :boolean, default: false, doc: "Indicates whether the radio is disabled"
  attr :class, :string, default: "", doc: "Additional CSS classes for the select"
  attr :rest, :global, doc: "Additional HTML attributes for the select"

  slot :label, doc: "Label for the select"
  slot :select_option, doc: "Options for the select"

  def select_component(assigns) do
    ~H"""
    <div class="moon-select-wrapper">
      <label :if={@label != []} for={@id}>{render_slot(@label)}</label>
      <div class="moon-select-input-container">
        <select
          id={@id}
          class={
            merge([
              "moon-select",
              get_size(@size),
              get_variant(@variant),
              get_select_error(@error),
              @class
            ])
          }
          disabled={@disabled}
          {@rest}
        >
          <option :for={option <- @select_option}>
            {render_slot(option)}
          </option>
        </select>
        <.component_icon name="chevron-down" class="moon-select-expand-icon" />
      </div>
    </div>
    """
  end

  def get_size("md"), do: ""
  def get_size(size), do: "moon-select-#{size}"

  def get_select_error(false), do: ""
  def get_select_error(true), do: "moon-select-error"

  def get_error(false), do: ""
  def get_error(true), do: "moon-form-group-error"

  defp get_variant("fill"), do: ""
  defp get_variant(variant), do: "moon-select-#{variant}"
end
