defmodule MoonLiveView.Tooltip do
  use MoonLiveView.Component

  attr :id, :string, required: true, doc: "Tooltip ID"

  attr :position, :string,
    default: "top",
    values: ~w(top bottom start end),
    doc: "Tooltip position relative to the trigger element"

  attr :has_pointer, :boolean,
    default: false,
    doc: "Adds an arrow to the Tooltip."

  slot :tooltip_content, required: true, doc: "What will be showed in the Tooltip."
  slot :inner_block, required: true

  def tooltip(assigns) do
    assigns =
      assigns
      |> build_tooltip_attrs()

    ~H"""
    <div data-testid="tooltip-trigger" phx-hook="Tooltip" {@tooltip_attrs}>
      {render_slot(@inner_block)}
      <div role="tooltip" class="moon-tooltip-content" data-base-position={@position}>
        {render_slot(@tooltip_content)}
      </div>
    </div>
    """
  end

  defp build_tooltip_attrs(assigns) do
    %{position: position, has_pointer: has_pointer} = assigns

    class =
      join([
        "moon-tooltip",
        classes(:position, position),
        classes(:has_pointer, has_pointer)
      ])

    attrs = assigns |> assigns_to_attributes([:tooltip_content, :id, :position, :variant])

    assign(assigns, tooltip_attrs: [class: class] ++ attrs)
  end

  defp classes(:position, ""), do: ""
  defp classes(:position, nil), do: ""
  defp classes(:position, position), do: "moon-tooltip-#{position}"

  defp classes(:has_pointer, true), do: "moon-tooltip-pointer"
  defp classes(:has_pointer, _), do: nil
end
