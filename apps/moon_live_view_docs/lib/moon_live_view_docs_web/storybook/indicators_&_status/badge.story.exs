defmodule Storybook.Components.CoreComponents.Badge do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Badge

  def function, do: &Badge.badge/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default"
      },
      %Variation{
        id: :label,
        description: "With Label",
        slots: ["222"]
      }
    ]
  end
end
