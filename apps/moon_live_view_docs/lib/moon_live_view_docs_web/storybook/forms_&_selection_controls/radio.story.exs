defmodule Storybook.Components.CoreComponents.Radio do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Radio

  def function, do: &Radio.radio/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        attributes: %{
          name: "default",
          value: "default"
        }
      },
      %Variation{
        id: :checked_radio,
        description: "Checked With Label",
        attributes: %{
          name: "checked",
          value: "checked",
          checked: true
        },
        slots: [
          """
          <:label>Checked</:label>
          """
        ]
      },
      %Variation{
        id: :disabled_radio,
        description: "Disabled",
        attributes: %{
          name: "disabled",
          value: "disabled",
          disabled: true
        },
        slots: [
          """
          <:label>Disabled</:label>
          """
        ]
      }
    ]
  end
end
