defmodule MoonLiveViewDocsWeb.Router do
  use MoonLiveViewDocsWeb, :router
  import PhoenixStorybook.Router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_live_flash)
    plug(:put_root_layout, html: {MoonLiveViewDocsWeb.Layouts, :root})
    plug(MoonLiveViewDocsWeb.Plugs.Direction)
    plug(MoonLiveViewDocsWeb.Plugs.Theme)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/" do
    pipe_through :browser
    storybook_assets()

    live_storybook("/",
      as: :moon_storybook,
      backend_module: MoonLiveViewDocsWeb.Storybook,
      session_name: :moon_storybook_iframe
    )
  end

  # Enable Swoosh mailbox preview in development
  if Application.compile_env(:moon_live_view_docs, :dev_routes) do
    scope "/dev" do
      pipe_through(:browser)

      forward("/mailbox", Plug.Swoosh.MailboxPreview)
    end
  end
end
