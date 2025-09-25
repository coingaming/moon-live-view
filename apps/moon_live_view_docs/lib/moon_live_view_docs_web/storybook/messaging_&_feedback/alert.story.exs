defmodule Storybook.Components.CoreComponents.Alert do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Alert

  def function, do: &Alert.alert/1

  def imports,
    do: [
      {Alert, alert_action_button: 1, alert_close_button: 1},
      {MoonAssets, icon: 1}
    ]

  def variations do
    [
      %Variation{
        id: :default,
        slots: [
          """
          Alert
          """
        ]
      },
      %Variation{
        id: :full_featured,
        attributes: %{},
        slots: [
          """
          Alert
          <:meta>
            <.alert_action_button>
              Action
            </.alert_action_button>
            <.alert_close_button />
          </:meta>
          <:content>
            Content
          </:content>
          """
        ]
      }
    ]
  end
end
