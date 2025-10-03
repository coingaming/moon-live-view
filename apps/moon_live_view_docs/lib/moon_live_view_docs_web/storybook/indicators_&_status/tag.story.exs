defmodule Storybook.Components.CoreComponents.Tag do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Tag

  def function, do: &Tag.tag/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        slots: [
          """
          Tag
          """
        ]
      },
      %Variation{
        id: :two_xs_size,
        description: "2xs size",
        attributes: %{size: "2xs"},
        slots: [
          """
          Tag
          """
        ]
      }
    ]
  end
end
