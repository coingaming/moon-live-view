defmodule Storybook.Components.CoreComponents.Drawer do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Drawer

  def function, do: &Drawer.drawer/1

  def imports,
    do: [{MoonLiveView.Button, button: 1}, {MoonLiveView.Drawer, show_drawer: 1}, {MoonLiveView.Drawer, drawer_close: 1}]

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
        <.button phx-click={show_drawer("drawer-single-default")} data-testid="drawer-default-open-button">
          Open Drawer
        </.button>
        <.psb-variation />
        """
      },
      %Variation{
        id: :full_featured,
        slots: [
          """
          <:header>
            Drawer
            <.drawer_close />
          </:header>
          """,
          """
          <div class="flex items-center justify-center h-full bg-brand-subtle text-brand">Content</div>
          """
        ],
        template: """
        <.button phx-click={show_drawer("drawer-single-full-featured")} data-testid="drawer-default-open-button">
          Open Drawer
        </.button>
        <.psb-variation />
        """
      }
    ]
  end
end
