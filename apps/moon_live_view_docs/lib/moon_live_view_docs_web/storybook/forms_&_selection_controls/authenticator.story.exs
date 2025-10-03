defmodule Storybook.MoonUIComponents.Authenticator do
  @moduledoc false
  use PhoenixStorybook.Story, :component

  alias MoonLiveView.Authenticator

  def function, do: &Authenticator.authenticator/1

  def variations do
    [
      %Variation{
        id: :default
      },
      %Variation{
        id: :with_label_and_hint,
        slots: [
          """
          <:label>Authenticator</:label>
          <:hint>Hint</:hint>
          """
        ]
      }
    ]
  end
end
