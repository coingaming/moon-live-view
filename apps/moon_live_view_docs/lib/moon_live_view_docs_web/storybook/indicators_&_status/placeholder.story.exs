defmodule Storybook.Components.CoreComponents.Placeholder do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Placeholder

  def function, do: &Placeholder.placeholder/1

  def template do
    """
    <div class="w-space-160 h-space-80">
        <.psb-variation />
    </div>
    """
  end

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default"
      }
    ]
  end
end
