defmodule Storybook.Components.CoreComponents.Pagination do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Pagination

  def function, do: &Pagination.pagination/1

  def variations do
    [
      %Variation{
        id: :default,
        attributes: %{
          total_items: 5
        }
      },
      %Variation{
        id: :full_featured,
        attributes: %{
          total_items: 5,
          active_item: 3,
          has_controls: true,
          base_param: "new_page"
        }
      }
    ]
  end
end
