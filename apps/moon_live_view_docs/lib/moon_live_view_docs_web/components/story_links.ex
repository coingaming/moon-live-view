defmodule MoonLiveViewDocsWeb.StoryLinks do
  @default_beta_moon_io "https://moondesignsystem.com/"
  @default_hex "https://hex.pm/packages/moon_live_view"
  @default_github "https://github.com/moondesignsystem/liveview"

  def story_links() do
    %{beta_moon_io: @default_beta_moon_io, hex: @default_hex, github: @default_github}
  end
end
