defmodule MoonLiveView.CircularProgress do
  use MoonLiveView.Component

  attr :class, :string, default: nil, doc: "Class for the circular progress bar"

  attr :size, :string,
    default: "md",
    values: ~w(xs sm md lg xl 2xl),
    doc: "Size of the circular progress bar. Default is `md`."

  attr :rest, :global

  def circular_progress(assigns) do
    assigns =
      assigns
      |> assign_new(:circular_progress_class, fn ->
        get_size(assigns.size) <> " moon-circular-progress"
      end)

    render_circular_progress(assigns)
  end

  defp render_circular_progress(assigns) do
    ~H"""
    {render_progress_bar(assigns)}
    """
  end

  defp render_progress_bar(assigns) do
    ~H"""
    <div class={join([@circular_progress_class, @class])} {@rest}></div>
    """
  end

  defp get_size("md"), do: ""
  defp get_size(size), do: "moon-circular-progress-#{size}"
end
