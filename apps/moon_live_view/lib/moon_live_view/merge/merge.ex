defmodule MoonLive.Merge do
  @moduledoc false
  use MoonLive.Merge.Custom, otp_app: :tails

  defmacro __using__(opts) do
    quote do
      use MoonLive.Merge.Custom, unquote(opts)
    end
  end
end
