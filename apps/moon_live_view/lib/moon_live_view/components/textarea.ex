defmodule MoonLiveView.Textarea do
  import MoonLiveView.Components
  use MoonLiveView.Component

  attr :id, :string, default: nil, doc: "Id for the Textarea"
  attr :error, :boolean, default: false, doc: "Error state flag"
  attr :disabled, :boolean, default: false, doc: "Disabled state flag"
  attr :size, :string, values: ~w"sm md lg xl", default: "md", doc: "Size of the Textarea"
  attr :variant, :string, values: ~w"fill outline", default: "fill", doc: "The variant of the Textarea"

  attr :class, :string, default: nil, doc: "Additional styles for the Textarea"
  attr :rest, :global, doc: "Extra attributes for the Textarea"

  slot :label, doc: "Textarea label" do
    attr(:class, :string, doc: "Additional style classes for the Textarea label")
  end

  slot(:hint, doc: "Information or Error massage") do
    attr(:class, :string, doc: "Additional style classes for the Textarea hint")
  end

  def textarea(assigns) do
    attrs = assigns_to_attributes(assigns, [:label, :hint, :error])
    assigns = assign(assigns, attrs: attrs)

    ~H"""
    <div class={join(["moon-form-group", if(@error, do: "moon-form-group-error")])}>
      <%= if @label != [] || @hint != [] do %>
        <.moon_label :for={label <- @label} :if={@label != []} for={@id} class={label[:class]}>
          {render_slot(@label)}
        </.moon_label>
        <.textarea_container {@attrs} />
        <.moon_hint :for={hint <- @hint} class={hint[:class] || ""}>
          {render_slot(hint)}
        </.moon_hint>
      <% else %>
        <.textarea_container {@attrs} />
      <% end %>
    </div>
    """
  end

  attr :id, :string, default: nil, doc: "Id for the Textarea"
  attr :size, :string, values: ~w"sm md lg xl", default: "md", doc: "Size of the Textarea"
  attr :disabled, :boolean, default: false, doc: "Disabled state flag"
  attr :variant, :string, values: ~w"fill outline", default: "fill", doc: "The variant of the Textarea"

  attr :class, :string, default: nil, doc: "Additional styles for the Textarea"
  attr :rest, :global, doc: "Extra attributes for the Textarea"

  defp textarea_container(assigns) do
    ~H"""
    <textarea
      id={@id}
      disabled={@disabled}
      class={join(["moon-textarea", get_size(@size), get_variant(@variant), @class])}
      {@rest}
    ></textarea>
    """
  end

  def get_size("md"), do: ""
  def get_size(size), do: "moon-textarea-#{size}"

  def get_variant("fill"), do: ""
  def get_variant(variant), do: "moon-textarea-#{variant}"
end
