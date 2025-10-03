defmodule Storybook.Components.CoreComponents.List do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.List
  alias MoonLiveViewDocs.Icon

  def function, do: &List.list/1

  def imports(),
    do: [
      {MoonLiveView.List, list_item: 1},
      {Icon, icon: 1}
    ]

  def variations do
    [
      %Variation{
        id: :default,
        slots: [
          """
          <.list_item>
            Item 1
          </.list_item>
          <.list_item>
            Item 2
          </.list_item>
          <.list_item>
            Item 3
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
            Item 1
            <:meta>
              <.icon name="star" />
            </:meta>
          </.list_item>
          <.list_item>
            <.icon name="star" />
            Item 2
            <:meta>
              <.icon name="star" />
            </:meta>
          </.list_item>
          <.list_item>
            <.icon name="star" />
            Item 3
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
