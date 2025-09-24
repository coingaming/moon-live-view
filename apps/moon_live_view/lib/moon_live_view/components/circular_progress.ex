defmodule MoonLive.CircularProgress do
  use MoonLive.Component

  attr :class, :string, default: nil, doc: "Class for the circular progress bar"
  attr :value, :integer, default: 0, doc: "The value of the circular progress bar"

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
      |> assign_new(:normalized_value, fn -> normalize_integer(assigns[:value]) end)

    render_circular_progress(assigns)
  end

  defp render_circular_progress(assigns) do
    ~H"""
    {render_progress_bar(assigns)}
    """
  end

  defp render_progress_bar(assigns) do
    ~H"""
    <div class={merge([@circular_progress_class, @class])} data-value={@normalized_value} {@rest}>
      <div class="moon-circular-progress-bar"></div>
    </div>
    """
  end

  defp get_size("md"), do: ""
  defp get_size(size), do: "moon-circular-progress-#{size}"

  defp normalize_integer(value) when is_integer(value), do: value

  defp normalize_integer(value) when is_binary(value) do
    case Integer.parse(value) do
      {integer, _} -> integer
      _ -> 0
    end
  end

  defp normalize_integer(_), do: 0
end
