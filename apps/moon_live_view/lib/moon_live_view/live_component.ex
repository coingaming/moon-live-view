defmodule MoonLive.LiveComponent do
  @moduledoc "Some library-common helpers and functions adding over Phoenix.LiveComponent"

  defmacro __using__(opts \\ []) do
    quote do
      use Phoenix.LiveComponent, unquote(opts)
    end
  end
end
