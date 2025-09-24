defmodule MoonLiveView.SegmentedControl do
  use MoonLiveView.Component
  alias Phoenix.LiveView.JS

  attr :id, :string, required: true, doc: "Id of Segmented Control"
  attr :size, :string, values: ~w(sm md), default: "md", doc: "Size of the Segmented Control"

  attr :class, :string, default: "", doc: "CSS class for the Segmented Control"
  attr :rest, :global, doc: "Additional attributes for the Segmented Control"

  slot :segmented_control_item, doc: "Slot for the Segmented Control Item" do
    attr :disabled, :boolean, doc: "Disable the Segmented Control Item"
    attr :on_select, JS, doc: "JS function to call when the Segmented Control Item is selected"
    attr :class, :string, doc: "CSS class for the Segmented Control Item"
    attr :rest, :map, doc: "Additional attributes for the Segmented Control Item"
    attr :is_active, :boolean, doc: "Whether the Segmented Control Item is active"
  end

  def segmented_control(assigns) do
    ~H"""
    <div id={@id} role="tablist" class={join(["moon-segmented-control", get_size(@size), @class])} {@rest}>
      <button
        :for={segment <- @segmented_control_item}
        role="tab"
        disabled={segment[:disabled] || false}
        phx-click={set_active_segment(segment[:on_select] || %JS{}, @id)}
        class={
          join([
            "moon-segmented-control-item",
            is_active_segment(segment[:is_active] || false),
            segment[:class]
          ])
        }
      >
        {render_slot(segment)}
      </button>
    </div>
    """
  end

  defp is_active_segment(true), do: "moon-segmented-control-item-active"
  defp is_active_segment(false), do: ""

  defp get_size("md"), do: ""
  defp get_size("sm"), do: "moon-segmented-control-sm"

  defp set_active_segment(js, segments_id) do
    js
    |> JS.remove_class("moon-segmented-control-item-active", to: "##{segments_id} .moon-segmented-control-item-active")
    |> JS.add_class("moon-segmented-control-item-active")
  end
end
