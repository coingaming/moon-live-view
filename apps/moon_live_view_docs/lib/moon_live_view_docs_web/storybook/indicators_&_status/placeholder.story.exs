defmodule Storybook.Components.CoreComponents.Placeholder do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Placeholder

  def function, do: &Placeholder.placeholder/1

  def template do
    """
    <div class="w-40 h-20">
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
