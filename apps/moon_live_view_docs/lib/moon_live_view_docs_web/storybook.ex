defmodule MoonLiveViewDocsWeb.Storybook do
  use PhoenixStorybook,
    otp_app: :moon_live_view_docs,
    content_path: Path.expand("./storybook", __DIR__),
    # assets path are remote path, not local file-system paths
    css_path: "/assets/storybook.css",
    js_path: "/assets/storybook.js",
    sandbox_class: "moon-live-docs",
    title: "Moon Liveview Library"
end
