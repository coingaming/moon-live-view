defmodule Storybook.Components.CoreComponents.Menu do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Menu
  alias MoonLiveViewDocs.Icon

  def function, do: &Menu.menu/1

  def imports, do: [{Icon, [icon: 1]}, {Menu, [menu_item: 1]}]

  def variations do
    [
      %Variation{
        id: :default,
        slots: [
          """
          <.menu_item>
            Item 1
          </.menu_item>
          <.menu_item>
            Item 2
          </.menu_item>
          <.menu_item>
            Item 3
          </.menu_item>
          """
        ]
      },
      %Variation{
        id: :meta_content,
        slots: [
          """
          <.menu_item>
            <.icon name='star' />
            Item 1
            <:meta>
              <.icon name='chevron-right' />
            </:meta>
          </.menu_item>
          <.menu_item>
            <.icon name='star' />
            Item 2
            <:meta>
              <.icon name='chevron-right' />
            </:meta>
          </.menu_item>
          <.menu_item>
            <.icon name='star' />
            Item 3
            <:meta>
              <.icon name='chevron-right' />
            </:meta>
          </.menu_item>
          """
        ]
      }
    ]
  end
end
