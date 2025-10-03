defmodule MoonLiveViewDocsWeb.ComponentPreview do
  @moduledoc """
    Wrapper for examples
  """

  use Phoenix.Component

  def component_preview(assigns) do
    ~H"""
    <div class="relative flex flex-wrap items-center justify-around p-space-16 gap-space-8 w-full rounded-t-8 border border-primary bg-secondary">
      {render_slot(@inner_block)}
    </div>
    """
  end
end
