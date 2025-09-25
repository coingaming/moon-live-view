defmodule Storybook.Components.CoreComponents.TabList do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.TabList

  def function, do: &TabList.tab_list/1

  def imports, do: [{MoonAssets, icon: 1}, {TabList, tab_item: 1}]

  def variations do
    [
      %Variation{
        id: :default_2,
        description: "Default 2",
        attributes: %{},
        slots: [
          """
          <:tab_list_item>
            Tab 1
          </:tab_list_item>
          <:tab_list_item is_active>
            Tab 2
          </:tab_list_item>
          <:tab_list_item>
            Tab 3
          </:tab_list_item>
          """
        ]
      },
      %Variation{
        id: :with_icons,
        description: "With Icons",
        attributes: %{},
        slots: [
          """
          <:tab_list_item>
            <.icon name='star' />
            Tab 1
          </:tab_list_item>
          <:tab_list_item is_active>
            <.icon name='star' />
            Tab 2
            <.icon name='star' />
          </:tab_list_item>
          <:tab_list_item>
            Tab 3
            <.icon name='star' />
          </:tab_list_item>
          """
        ]
      }
    ]
  end
end
