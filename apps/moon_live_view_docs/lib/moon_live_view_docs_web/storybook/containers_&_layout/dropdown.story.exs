defmodule Storybook.Components.CoreComponents.Dropdown do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Dropdown

  def function, do: &Dropdown.dropdown/1

  def imports,
    do: [
      {MoonLiveView.Button, [button: 1]}
    ]

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        attributes: %{},
        slots: [
          """
          <:trigger>
            Open Dropdown
          </:trigger>
          <:content>
            <div class="w-full flex items-center justify-center h-20 bg-brand-subtle text-brand">
              Content
            </div>
          </:content>
          """
        ]
      }
    ]
  end
end
