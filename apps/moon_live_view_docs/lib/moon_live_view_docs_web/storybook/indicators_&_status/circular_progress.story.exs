defmodule Storybook.CircularProgressStory do
  @moduledoc false
  use PhoenixStorybook.Story, :component

  alias MoonLiveView.CircularProgress

  def function, do: &CircularProgress.circular_progress/1

  def variations do
    [
      %Variation{
        id: :progress_bar,
        attributes: %{
          style: "--value:25"
        }
      }
    ]
  end
end
