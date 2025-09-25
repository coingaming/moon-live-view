defmodule Storybook.Components.CoreComponents.Checkbox do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Checkbox

  def function, do: &Checkbox.checkbox/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        attributes: %{}
      },
      %Variation{
        id: :with_label,
        description: "With Label",
        attributes: %{},
        slots: [
          """
          <:label>With Label</:label>
          """
        ]
      },
      %Variation{
        id: :indeterminate,
        description: "Indeterminate state",
        attributes: %{
          indeterminate: true
        },
        slots: [
          """
          <:label>Indeterminate</:label>
          """
        ]
      }
    ]
  end
end
