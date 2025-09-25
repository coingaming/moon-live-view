defmodule Storybook.Components.CoreComponents.Switch do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Switch

  def container, do: {:div, dir: "ltr"}

  def function, do: &Switch.switch/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default"
      }
    ]
  end
end
