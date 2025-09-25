defmodule Storybook.Components.CoreComponents.Textarea do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Textarea

  def function, do: &Textarea.textarea/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default"
      },
      %Variation{
        id: :label_and_hint,
        description: "Label & Hint",
        slots: [
          """
          <:label>Label</:label>
          <:hint>Hint</:hint>
          """
        ]
      }
    ]
  end
end
