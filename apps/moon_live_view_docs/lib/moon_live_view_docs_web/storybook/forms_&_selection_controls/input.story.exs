defmodule Storybook.Components.CoreComponents.Input do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Input

  def function, do: &Input.input/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default"
      },
      %Variation{
        id: :with_label_and_hint,
        description: "With label and hint",
        attributes: %{},
        slots: [
          """
          <:label>label</:label>
          <:hint>
          test
          </:hint>
          """
        ]
      }
    ]
  end
end
