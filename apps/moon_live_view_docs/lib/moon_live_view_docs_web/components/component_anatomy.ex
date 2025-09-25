defmodule MoonLiveViewDocsWeb.ComponentAnatomy do
  @moduledoc "ComponentAnatomy"

  use Phoenix.Component

  def component_anatomy(assigns) do
    ~H"""
    <div class="flex flex-col gap-space-16">
      <h2 class="text-heading-200">Anatomy</h2>
      <pre class="py-space-12 border border-primary bg-primary rounded-8 text-primary font-mono overflow-y-auto">
          <%= render_slot(@inner_block) %>
      </pre>
    </div>
    """
  end
end
