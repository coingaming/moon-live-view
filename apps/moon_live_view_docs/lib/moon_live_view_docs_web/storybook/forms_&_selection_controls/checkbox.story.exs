defmodule Storybook.Components.CoreComponents.Checkbox do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Checkbox

  def function, do: &Checkbox.checkbox/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default"
      },
      %Variation{
        id: :with_label,
        slots: [
          """
          <:label>With Label</:label>
          """
        ]
      },
      %Variation{
        id: :indeterminate,
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
