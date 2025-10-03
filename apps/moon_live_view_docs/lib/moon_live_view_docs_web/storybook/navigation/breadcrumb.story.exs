defmodule Storybook.Components.CoreComponents.Breadcrumb do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Breadcrumb

  def function, do: &Breadcrumb.breadcrumb/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        attributes: %{},
        slots: [
          """
          <:breadcrumb_item><.link> Page 1 </.link></:breadcrumb_item>
          <:breadcrumb_item><.link> Page 2 </.link></:breadcrumb_item>
          <:breadcrumb_item><.link> Page 3 </.link></:breadcrumb_item>
          <:breadcrumb_item><.link> Page 4 </.link></:breadcrumb_item>
          <:breadcrumb_item is_active={true}><.link> Page 5 </.link></:breadcrumb_item>
          """
        ]
      }
    ]
  end
end
