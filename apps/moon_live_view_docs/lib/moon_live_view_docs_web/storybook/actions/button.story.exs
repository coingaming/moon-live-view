defmodule Storybook.ButtonStory do
  use PhoenixStorybook.Story, :component

  alias MoonLiveView.Button
  def function, do: &Button.button/1

  def variations do
    [
      %Variation{
        id: :default,
        slots: ["Default"]
      }
    ]
  end
end
