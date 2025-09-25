defmodule MoonLiveViewDocsWeb.ComponentInfo do
  @moduledoc "ComponentInfo"

  use Phoenix.Component
  import MoonLiveView.Tag

  attr :name, :string, required: true
  attr :description, :string, default: nil
  attr :aria, :boolean, default: false
  attr :rtl, :boolean, default: false
  attr :preview, :boolean, default: false
  slot :content

  def component_info(assigns) do
    ~H"""
    <div class="flex max-w-3xl flex-col gap-space-16 lg:gap-space-24 text-body-400">
      <div class="flex flex-col gap-space-8">
        <h1 class="flex items-baseline gap-space-12 text-heading-300">
          {@name}
        </h1>
        <div class="flex gap-space-8 mb-space-16">
          <%= if @aria do %>
            <.tag size="2xs" class="bg-positive">
              ARIA
            </.tag>
          <% end %>
          <%= if @rtl do %>
            <.tag size="2xs" class="bg-info text-force-light">
              RTL
            </.tag>
          <% end %>
          <%= if @preview do %>
            <.tag size="2xs" class="bg-negative">
              Preview
            </.tag>
          <% end %>
        </div>
      </div>
      {render_slot(@content)}
      <p>
        {@description}
      </p>
    </div>
    """
  end
end
