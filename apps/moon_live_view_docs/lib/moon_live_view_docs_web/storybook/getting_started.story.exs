defmodule Storybook.Installation do
  import MoonLiveViewDocsWeb.{DocsComponents, CoreComponents, LinksBlock}

  use PhoenixStorybook.Story, :page
  alias Makeup

  def render(assigns) do
    ~H"""
    <div class="flex w-full max-w-7xl flex-col gap-space-48 text-md pb-space-40">
      <.links_block />
      <p>
        Moon is a multi-layered, scalable, customizable, and adaptable Design System.<br /><br />
        Moon Liveview represents the third layer of the Moon Design System. The package relies on Moon UI CSS classes, which compose the second layer of Moon Design System.<br /><br />
        Moon Liveview provides simple composable functional components.
      </p>
      <.step title="Prerequisites">
        <:description>
          Ensure you have the following prerequisites in place before proceeding with the installation:
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <.link
                href="https://hex.pm/packages/phoenix_live_view"
                target="_blank"
                class="text-link"
              >
                Liveview 1.0
              </.link>
            </li>

            <li>
              Before getting into work, we encourage you to use
              <.link
                href="https://ui.moondesignsystem.com"
                target="_blank"
                class="text-link"
              >
                Moon UI
              </.link>
              to set up your default styling.
            </li>
            <li>
              Optional: Tailwind CSS version 4 or higher. You may find installation steps at
              <.link
                href="https://tailwindcss.com/docs/installation/framework-guides/phoenix"
                target="_blank"
                class="text-link"
              >
                Install Tailwind in Phoenix LivView
              </.link>
            </li>
          </ul>
        </:description>
      </.step>

      <.step title="Step 1: Add a dependency">
        <:description>
          Add a private {code_inline("moon_live_view")} package to {code_inline("mix.exs")} file:
        </:description>
        <:code>
          {code_block(~c'defp deps do
        [
          {:moon_live_view, "~> #{version()}"},
        ]
      end')}
        </:code>
      </.step>

      <.step title="Step 2: Install dependencies">
        <:code>
          {code_block(~c'mix deps.get')}
        </:code>
      </.step>
      <.step title="Step 3: Add static plug">
        <:description>
          Add a static plug to {code_inline("endpoint.ex")} file to serve static moon icons:
        </:description>
        <:code>
          {code_block(~c'plug Plug.Static,
          at: "/moon_live_view/",
          from: :moon_live_view,
          gzip: true')}
        </:code>
      </.step>
      <.step title="Step 4: Add MoonLiveView">
        <:description>
          Add MoonLiveView to {code_inline("html_helpers")} function to make the package available globally:
        </:description>
        <:code>
          {code_block(~c'defp html_helpers do
        quote do
          use MoonLiveView
        end
      end')}
        </:code>
      </.step>
      <.step title="Step 5: Add MoonHooks">
        <:description>
          Add {code_inline("moonHooks")} to {code_inline("app.js")} file to enable MoonLiveView components' functionality:
        </:description>
        <:code>
          {code_block(~c'import moonHooks from "../../deps/moon_live_view/assets/js/hooks/";

      let liveSocket = new LiveSocket("/live", Socket, {
        hooks: {
          ...
          ...moonHooks,
        },
      });')}
        </:code>
      </.step>
      <.step title="Step 6. Update root HTML file">
        <:description>
          Update HTML and BODY tags in {code_inline("root.html.heex")} file. Add {code_inline("dir")} attribute to the HTML tag to fully enable the LTR/RTL feature of Tailwind. Additionally, add a main theme class to the BODY tag to enable theme support in your app:
        </:description>
        <:code>
          {code_block(~c'<html dir="ltr">
      <body class="light-theme">')}
        </:code>
      </.step>
      <.step title="Happy coding!"></.step>
    </div>
    """
  end

  defp version do
    fetch_version()
  end
end
