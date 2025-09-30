defmodule Storybook.Components.CoreComponents.Accordion do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Accordion
  alias MoonLiveViewDocs.Icon

  def function, do: &Accordion.accordion/1

  def imports,
    do: [
      {MoonLiveView.Accordion,
       [
         accordion_item: 1,
         accordion_item_header: 1,
         accordion_item_content: 1,
         accordion_item_toggle: 1
       ]},
      {Icon, icon: 1}
    ]

  def variations do
    [
      %Variation{
        id: :default,
        slots: [
          """
          <.accordion_item>
            <.accordion_item_header>
              Item 1
            </.accordion_item_header>
            <.accordion_item_content>
              Content
            </.accordion_item_content>
          </.accordion_item>
          <.accordion_item>
            <.accordion_item_header>
              Item 2
            </.accordion_item_header>
            <.accordion_item_content>
              Content
            </.accordion_item_content>
          </.accordion_item>
          <.accordion_item>
            <.accordion_item_header>
              Item 3
            </.accordion_item_header>
            <.accordion_item_content>
              Content
            </.accordion_item_content>
          </.accordion_item>
          """
        ]
      },
      %Variation{
        id: :with_header_toggle,
        slots: [
          """
          <.accordion_item>
            <.accordion_item_header>
              Item 1
              <:meta>
              <.accordion_item_toggle />
              </:meta>
            </.accordion_item_header>
            <.accordion_item_content>
              Content
            </.accordion_item_content>
          </.accordion_item>
          <.accordion_item>
            <.accordion_item_header>
              Item 2
              <:meta>
              <.accordion_item_toggle />
              </:meta>
            </.accordion_item_header>
            <.accordion_item_content>
              Content
            </.accordion_item_content>
          </.accordion_item>
          <.accordion_item>
            <.accordion_item_header>
              Item 3
              <:meta>
              <.accordion_item_toggle />
              </:meta>
            </.accordion_item_header>
            <.accordion_item_content>
              Content
            </.accordion_item_content>
          </.accordion_item>
          """
        ]
      }
    ]
  end
end
