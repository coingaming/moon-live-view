defmodule Storybook.Components.CoreComponents.Select do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Select

  def function, do: &Select.select/1

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        attributes: %{},
        slots: [
          """
          <:select_option>Option 1</:select_option>
          <:select_option>Option 2</:select_option>
          <:select_option>Option 3</:select_option>
          """
        ]
      },
      %Variation{
        id: :default_with_label_and_hint,
        description: "Default With Label And Hint",
        attributes: %{},
        slots: [
          """
          <:label>label</:label>
          <:hint>hint</:hint>
          <:select_option>Option 1</:select_option>
          <:select_option>Option 2</:select_option>
          <:select_option>Option 3</:select_option>
          """
        ]
      }
    ]
  end
end
