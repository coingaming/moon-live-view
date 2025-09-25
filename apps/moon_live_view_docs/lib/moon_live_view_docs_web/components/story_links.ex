defmodule MoonLiveViewDocsWeb.StoryLinks do
  @default_beta_moon_io "https://beta.moon.io/"
  @default_hex "https://hex.pm/packages/coingaming/moon_live_view"
  @default_github "https://github.com/coingaming/moon-live"

  def story_links() do
    %{beta_moon_io: @default_beta_moon_io, hex: @default_hex, github: @default_github}
  end
end
