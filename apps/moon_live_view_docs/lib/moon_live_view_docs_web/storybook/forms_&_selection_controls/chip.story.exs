defmodule Storybook.Components.CoreComponents.Chip do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Chip

  def function, do: &Chip.chip/1

  def imports,
    do: [
      {MoonAssets, icon: 1}
    ]

  def variations do
    [
      %Variation{
        id: :default,
        slots: ["Chip"]
      },
      %Variation{
        id: :is_active,
        attributes: %{
          is_active: true
        },
        slots: ["Chip"]
      },
      %Variation{
        id: :with_icons,
        template: """
        <.chip >
          <.icon name="star" class="icon-neutral" />
          Chip
          <.icon name="star" class="icon-neutral" />
        </.chip>
        """
      }
    ]
  end
end
