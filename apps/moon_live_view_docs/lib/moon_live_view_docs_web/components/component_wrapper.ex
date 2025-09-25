defmodule MoonLiveViewDocsWeb.ComponentWrapper do
  @moduledoc "ComponentWrapper"

  use Phoenix.Component

  def component_wrapper(assigns) do
    ~H"""
    <div class="flex w-full max-w-7xl mx-auto flex-col gap-space-48 text-body-300 pb-space-40">
      {render_slot(@inner_block)}
    </div>
    """
  end
end
