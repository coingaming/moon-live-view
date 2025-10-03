defmodule Storybook.Components.CoreComponents.Carousel do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Carousel

  def function, do: &Carousel.carousel/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        attributes: %{
          active_item: 2
        },
        slots: [
          """
          <:carousel_item>
            <div class="flex items-center justify-center h-space-160 w-width-288 bg-brand-subtle text-brand">
              Item 1
            </div>
          </:carousel_item>
          <:carousel_item>
            <div class="flex items-center justify-center h-space-160 w-width-288 bg-brand-subtle text-brand">
              Item 2
            </div>
          </:carousel_item>
          <:carousel_item>
            <div class="flex items-center justify-center h-space-160 w-width-288 bg-brand-subtle text-brand">
              Item 3
            </div>
          </:carousel_item>
          <:carousel_item>
            <div class="flex items-center justify-center h-space-160 w-width-288 bg-brand-subtle text-brand">
              Item 4
            </div>
          </:carousel_item>
          <:carousel_item>
            <div class="flex items-center justify-center h-space-160 w-width-288 bg-brand-subtle text-brand">
              Item 5
            </div>
          </:carousel_item>
          """
        ]
      },
      %Variation{
        id: :has_controls,
        description: "Has controls",
        attributes: %{
          active_item: 2,
          has_controls: true
        },
        slots: [
          """
          <:carousel_item>
            <div class="flex items-center justify-center h-space-160 w-72 bg-brand-subtle text-brand">
              Item 1
            </div>
          </:carousel_item>
          <:carousel_item>
            <div class="flex items-center justify-center h-space-160 w-72 bg-brand-subtle text-brand">
              Item 2
            </div>
          </:carousel_item>
          <:carousel_item>
            <div class="flex items-center justify-center h-space-160 w-72 bg-brand-subtle text-brand">
              Item 3
            </div>
          </:carousel_item>
          <:carousel_item>
            <div class="flex items-center justify-center h-space-160 w-72 bg-brand-subtle text-brand">
              Item 4
            </div>
          </:carousel_item>
          <:carousel_item>
            <div class="flex items-center justify-center h-space-160 w-72 bg-brand-subtle text-brand">
              Item 5
            </div>
          </:carousel_item>
          """
        ]
      }
    ]
  end
end
