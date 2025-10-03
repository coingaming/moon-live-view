defmodule Storybook.Components.CoreComponents.Radio do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Radio

  def function, do: &Radio.radio_group/1

  def imports, do: [{Radio, [radio: 1]}]

  def variations do
    [
      %Variation{
        id: :default,
        slots: [
          """
          <.radio name="default">
            <:label>
              Option 1
            </:label>
          </.radio>
          <.radio name="default">
            <:label>
              Option 2
            </:label>
          </.radio>
          """
        ]
      },
      %Variation{
        id: :disabled,
        slots: [
          """
          <.radio name="disabled" disabled>
            <:label>
              Option 1
            </:label>
          </.radio>
          <.radio name="disabled" disabled>
            <:label>
              Option 2
            </:label>
          </.radio>
          """
        ]
      }
    ]
  end
end
