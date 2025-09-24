defmodule MoonLiveView.Component do
  @moduledoc "Some library-common helpers and functions adding over Phoenix.Component"

  defmacro __using__(opts \\ []) do
    quote do
      use Phoenix.Component, unquote(opts)
      import MoonLiveView.ComponentIcon
      import MoonLiveView.Utils
    end
  end
end
