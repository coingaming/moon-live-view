defmodule Storybook.Components.CoreComponents.Avatar do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Avatar

  def function, do: &Avatar.avatar/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default"
      },
      %Variation{
        id: :inner_content,
        description: "Inner content",
        slots: ["AB"]
      }
    ]
  end
end
