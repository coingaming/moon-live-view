defmodule MoonLiveViewDocsWeb.SwitchLive.Examples do
  @moduledoc false
  use Phoenix.Component
  use MoonLiveView

  @doc """
  # Sizes
  The component <Button /> supports various sizes using the size prop, allowing integration with your custom layout. By default Medium md size if not specified.
  based on (Headless UI)[https://headlessui.dev/react/switch]
  """
  def sizes(assigns) do
    ~H"""
    <.switch /> @TODO [CODE OF EXAMPLE]
    """
  end

  @doc """
  # conditions
  The component <Button /> supports various conditions using the conditions prop, allowing integration with your custom layout. By default Medium md size if not specified.
  """

  def conditions(assigns) do
    ~H"""
    <.switch /> @TODO [CODE OF EXAMPLE]
    """
  end
end
