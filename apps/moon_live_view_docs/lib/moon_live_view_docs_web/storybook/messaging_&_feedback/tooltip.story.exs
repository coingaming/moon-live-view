defmodule Storybook.MoonUIComponents.Tooltip do
  @moduledoc false
  use PhoenixStorybook.Story, :component

  alias MoonLiveView.Tooltip
  alias MoonLiveView.Button

  def function, do: &Tooltip.tooltip/1
  def imports, do: [{Button, [button: 1]}]

  def variations do
    [
      %Variation{
        id: :default,
        slots: [
          """
          <.button>Hover me</.button>
          <:tooltip_content>
            Tooltip
          </:tooltip_content>
          """
        ]
      },
      %Variation{
        id: :has_pointer,
        attributes: %{has_pointer: true},
        slots: [
          """
          <.button>Hover me</.button>
          <:tooltip_content>
            Tooltip
          </:tooltip_content>
          """
        ]
      }
    ]
  end
end
