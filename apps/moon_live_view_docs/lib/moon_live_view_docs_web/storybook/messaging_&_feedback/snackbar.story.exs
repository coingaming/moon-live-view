defmodule Storybook.Components.CoreComponents.Snackbar do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.{Button, Snackbar}

  def function, do: &Snackbar.snackbar_group/1

  def imports,
    do: [
      {Button, button: 1},
      {Snackbar, show_snackbar: 6}
    ]

  def template do
    """
     <div>
      <.button phx-click={show_snackbar(
        %JS{},
        "fill",
        "brand",
        "snackbar",
        "snackbar-single-default",
        %{icon: "football", action: "show-toast-example", action_label: "Action"}
      )}>
        Open Snackbar
      </.button>
      <.psb-variation />
    </div>
    """
  end

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        attributes: %{
          icon_path: "/moon_live_view_docs/icons/"
        }
      }
    ]
  end
end
