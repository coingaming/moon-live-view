defmodule Storybook.Components.CoreComponents.BottomSheet do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.BottomSheet

  def function, do: &BottomSheet.bottom_sheet/1

  def imports,
    do: [{MoonLiveView.Button, button: 1}, {MoonLiveView.BottomSheet, show_bottom_sheet: 1}]

  def variations do
    [
      %Variation{
        id: :default,
        slots: [
          """
          <div class="flex items-center justify-center h-full bg-brand-subtle text-brand">Content</div>
          """
        ],
        template: """
        <div>
          <.button phx-click={show_bottom_sheet("bottom-sheet-single-default")}>
            Open Bottom Sheet
          </.button>
          <.psb-variation />
        </div>
        """
      },
      %Variation{
        id: :full_featured,
        attributes: %{
          has_handle: true,
          has_close_button: true
        },
        slots: [
          """
          <:header>
              Bottom Sheet
          </:header>
          <div class="flex items-center justify-center h-full bg-brand-subtle text-brand">Content</div>
          """
        ],
        template: """
        <div>
          <.button phx-click={show_bottom_sheet("bottom-sheet-single-full-featured")}>
            Open Bottom Sheet
          </.button>
          <.psb-variation />
        </div>
        """
      }
    ]
  end
end
