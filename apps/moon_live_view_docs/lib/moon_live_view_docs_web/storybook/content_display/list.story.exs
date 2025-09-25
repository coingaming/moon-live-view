defmodule Storybook.Components.CoreComponents.List do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.List

  def function, do: &List.list/1

  def imports(),
    do: [
      {MoonLiveView.List, list_item: 1},
      {MoonAssets, icon: 1}
    ]

  def variations do
    [
      %Variation{
        id: :default,
        slots: [
          """
          <.list_item>
            Label 1
          </.list_item>
          <.list_item>
            Label 2
          </.list_item>
          <.list_item>
            Label 3
          </.list_item>
          """
        ]
      },
      %Variation{
        id: :meta_content,
        slots: [
          """
          <.list_item>
            <.icon name="star" />
            Label 1
            <:meta>
              <.icon name="star" />
            </:meta>
          </.list_item>
          <.list_item>
            <.icon name="star" />
            Label 2
            <:meta>
              <.icon name="star" />
            </:meta>
          </.list_item>
          <.list_item>
            <.icon name="star" />
            Label 3
            <:meta>
              <.icon name="star" />
            </:meta>
          </.list_item>
          """
        ]
      }
    ]
  end
end
