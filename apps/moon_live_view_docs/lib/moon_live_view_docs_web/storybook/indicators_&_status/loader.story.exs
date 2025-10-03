defmodule Storybook.Components.CoreComponents.Loader do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Loader

  def function, do: &Loader.loader/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        attributes: %{}
      }
    ]
  end
end
