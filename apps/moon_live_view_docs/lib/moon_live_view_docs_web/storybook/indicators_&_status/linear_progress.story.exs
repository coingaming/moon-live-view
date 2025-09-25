defmodule Storybook.Components.CoreComponents.LinearProgress do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.LinearProgress

  def function, do: &LinearProgress.linear_progress/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        attributes: %{
          value: 70
        }
      },
      %Variation{
        id: :with_label,
        description: "With Label",
        attributes: %{
          value: 70
        },
        slots: [
          "<:label>Progress</:label>"
        ]
      }
    ]
  end
end
