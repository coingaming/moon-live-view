defmodule MoonLiveView.Authenticator do
  @moduledoc false
  import MoonLiveView.Components

  use MoonLiveView.Component

  attr :id, :string, required: true, doc: "The id of the Authenticator."
  attr :count, :integer, default: 6, doc: "The number of input fields"
  attr :size, :string, values: ~w"sm md lg xl", default: "md", doc: "The size of the Authenticator"
  attr :variant, :string, values: ~w"fill outline", default: "fill", doc: "The variant of the Authenticator"
  attr :disabled, :boolean, default: false, doc: "Set disabled state"
  attr :error, :boolean, default: false, doc: "Set error state for Authenticator"

  attr :class, :string, default: "", doc: "The class of the Authenticator."
  attr :rest, :global, doc: "The arbitrary HTML attributes to add to the Authenticator"

  slot :label, doc: "The label of the Authenticator." do
    attr(:class, :string, doc: "CSS class for the label element")
  end

  slot(:hint, required: false, doc: "Information or Error massage") do
    attr(:class, :string, doc: "CSS class for the hint element")
  end

  def authenticator(assigns) do
    attrs = assigns_to_attributes(assigns, [:label, :hint])
    assigns = assigns |> assign(attrs: attrs)

    ~H"""
    <%= if @label != [] || @hint != [] do %>
      <div class={join(["moon-form-group", error_classes(:error, assigns)])}>
        <.moon_label :for={label <- @label} :if={@label != []} for={"#{@id}-item-1"} class={label[:class]}>
          {render_slot(@label)}
        </.moon_label>
        <.authenticator_items {@attrs} />
        <.moon_hint :for={hint <- @hint} class={hint[:class] || ""}>
          {render_slot(hint)}
        </.moon_hint>
      </div>
    <% else %>
      <.authenticator_items {@attrs} />
    <% end %>
    """
  end

  attr :class, :string, default: "", doc: "The class of the authenticator."

  defp authenticator_items(assigns) do
    ~H"""
    <div
      id={@id}
      class={join(["moon-authenticator", get_variant(@variant), get_size(@size), @class])}
      phx-hook="Authenticator"
    >
      <.authenticator_item :for={count <- 1..@count} id={"#{@id}-item-#{count}"} disabled={@disabled} />
    </div>
    """
  end

  attr :id, :string, required: true, doc: "The id of the authenticator."
  attr :disabled, :boolean, default: false, doc: "Set disabled state"

  attr :rest, :global, doc: "The arbitrary HTML attributes to add to the authenticator item."

  defp authenticator_item(assigns) do
    ~H"""
    <input
      id={@id}
      type="text"
      maxlength="1"
      disabled={@disabled}
      inputmode="alphanumeric"
      autocomplete="one-time-code"
      {@rest}
    />
    """
  end

  defp get_size("md"), do: ""
  defp get_size(size), do: "moon-authenticator-#{size}"

  defp error_classes(:error, %{error: true}), do: "moon-form-group-error"
  defp error_classes(:error, %{error: false}), do: nil

  defp get_variant("fill"), do: ""
  defp get_variant(variant), do: "moon-authenticator-#{variant}"
end
