defmodule MoonLiveView.Merge do
  @moduledoc false
  use MoonLiveView.Merge.Custom, otp_app: :tails

  defmacro __using__(opts) do
    quote do
      use MoonLiveView.Merge.Custom, unquote(opts)
    end
  end
end
