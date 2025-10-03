defmodule Storybook.IconButtonStory do
  use PhoenixStorybook.Story, :component

  alias MoonLiveView.IconButton
  alias MoonLiveViewDocs.Icon
  def imports, do: [{Icon, [icon: 1]}]

  def function, do: &IconButton.icon_button/1

  def variations do
    [
      %Variation{
        id: :default,
        slots: ["<.icon name='star'/>"]
      }
    ]
  end
end
