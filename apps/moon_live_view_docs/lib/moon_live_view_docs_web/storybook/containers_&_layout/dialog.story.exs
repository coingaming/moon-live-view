defmodule Storybook.Components.CoreComponents.Dialog do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Dialog

  def function, do: &Dialog.dialog/1

  def imports,
    do: [{MoonLiveView.Button, button: 1}, {MoonLiveView.Dialog, show_dialog: 1}, {MoonLiveView.Dialog, dialog_close: 1}]

  def variations do
    [
      %Variation{
        id: :default,
        slots: [
          """
          <div class="w-full flex items-center justify-center h-40 bg-brand-subtle text-brand">Content</div>
          """
        ],
        template: """
          <.button phx-click={show_dialog("dialog-single-default")} data-testid="dialog-default-open-button">
            Open Dialog
          </.button>
          <.psb-variation />
        """
      },
      %Variation{
        id: :with_header,
        slots: [
          """
          <:header>
            Dialog
            <.dialog_close />
          </:header>
          <div class="flex items-center justify-center h-40 bg-brand-subtle text-brand">Content</div>
          """
        ],
        template: """
          <.button phx-click={show_dialog("dialog-single-with-header")} data-testid="dialog-default-open-button">
            Open Dialog
          </.button>
          <.psb-variation />
        """
      }
    ]
  end
end
