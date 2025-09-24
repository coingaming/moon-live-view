defmodule MoonLive.TabList do
  use MoonLive.Component
  alias Phoenix.LiveView.JS

  attr :id, :string, default: nil, doc: "Unique identifier for the Tab List component"
  attr :size, :string, values: ~w"sm md", default: "md", doc: "Size of the Tab List"
  attr :class, :string, default: "", doc: "Additional CSS classes for the Tab List"
  attr :rest, :global, doc: "Additional HTML attributes for the Tab List"

  slot :inner_block

  slot :tab_list_item, doc: "Tab List item" do
    attr :is_active, :boolean, doc: "If true, the tab item is active"
    attr :class, :string, doc: "Additional CSS classes for the Tab List Item"
  end

  def tab_list(assigns) do
    ~H"""
    <div id={@id} role="tablist" class={join(["moon-tab-list", get_size(@size), @class])} {@rest}>
      <button
        :for={tab_list_item <- @tab_list_item}
        role="tab"
        class={join(["moon-tab-list-item", get_is_active(tab_list_item[:is_active] || false), tab_list_item[:class]])}
        phx-click={set_active_tab(@id)}
      >
        {render_slot(tab_list_item)}
      </button>
    </div>
    """
  end

  defp set_active_tab(js \\ %JS{}, id) do
    js
    |> JS.remove_class("moon-tab-list-item-active", to: "##{id} [role='tab'].moon-tab-list-item-active")
    |> JS.add_class("moon-tab-list-item-active")
  end

  defp get_size("md"), do: ""
  defp get_size(size), do: "moon-tab-list-#{size}"

  def get_is_active(false), do: ""
  def get_is_active(true), do: "moon-tab-list-item-active"
end
