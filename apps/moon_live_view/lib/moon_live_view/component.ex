defmodule MoonLive.Component do
  @moduledoc "Some library-common helpers and functions adding over Phoenix.Component"

  defmacro __using__(opts \\ []) do
    quote do
      use Phoenix.Component, unquote(opts)
      import MoonLive.ComponentIcon
      import MoonLive.Utils
    end
  end
end
