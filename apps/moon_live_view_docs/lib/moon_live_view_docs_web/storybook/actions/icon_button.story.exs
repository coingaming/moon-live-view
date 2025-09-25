defmodule Storybook.IconButtonStory do
  use PhoenixStorybook.Story, :component

  alias MoonLiveView.IconButton
  def imports, do: [{MoonAssets, [icon: 1]}]

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
