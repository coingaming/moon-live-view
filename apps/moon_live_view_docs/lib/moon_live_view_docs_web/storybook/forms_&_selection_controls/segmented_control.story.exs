defmodule Storybook.MoonUIComponents.SegmentedControlStory do
  use PhoenixStorybook.Story, :component

  alias MoonLiveView.SegmentedControl
  alias MoonLiveViewDocs.Icon

  def function, do: &SegmentedControl.segmented_control/1

  def imports, do: [{SegmentedControl, [segments_list: 1]}, {Icon, icon: 1}]

  def variations do
    [
      %Variation{
        id: :default,
        slots: [
          """
          <:segmented_control_item>Segment 1</:segmented_control_item>
          <:segmented_control_item is_active>Segment 2</:segmented_control_item>
          <:segmented_control_item>Segment 3</:segmented_control_item>
          """
        ]
      },
      %Variation{
        id: :with_icons,
        slots: [
          """
          <:segmented_control_item>
            <.icon name="star"/>
            Segment 1
          </:segmented_control_item>
          <:segmented_control_item is_active>
            <.icon name="star"/>
            Segment 2
            <.icon name="star"/>
          </:segmented_control_item>
          <:segmented_control_item>
            Segment 3
            <.icon name="star"/>
          </:segmented_control_item>
          """
        ]
      }
    ]
  end
end
