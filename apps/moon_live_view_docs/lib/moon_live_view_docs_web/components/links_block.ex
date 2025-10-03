defmodule MoonLiveViewDocsWeb.LinksBlock do
  use Phoenix.Component
  alias MoonLiveViewDocsWeb.StoryLinks

  attr :class, :string, default: nil

  attr :story_type, :atom, values: [:component, :page]
  attr :story_name, :string
  attr :story_path, :map

  def links_block(assigns) do
    assigns = assigns |> assign(StoryLinks.story_links())

    ~H"""
    <div class="flex flex-col sm:flex-row gap-space-12">
      <a
        href={@beta_moon_io}
        target="_blank"
        class="overflow-hidden flex items-center border border-primary rounded-4 h-space-48"
      >
        <div class="flex items-center justify-center h-full aspect-square bg-tertiary">
          <img src="/images/logo.png" alt="Website" class="w-space-40" />
        </div>
        <div class="flex flex-col px-space-8">
          <span class="text-md font-medium">Moon Design System</span>
          <span class="text-sm text-secondary">Website</span>
        </div>
      </a>
      <a
        href={@hex}
        target="_blank"
        class="overflow-hidden flex items-center border border-primary rounded-4 h-space-48"
      >
        <div class="flex items-center justify-center h-full aspect-square bg-tertiary">
          <img src="/images/hex.png" alt="HEX" class="w-space-40" />
        </div>
        <div class="flex flex-col px-space-8">
          <span class="text-md font-medium">View package</span>
          <span class="text-sm text-secondary">HEX</span>
        </div>
      </a>
      <a
        href={@github}
        target="_blank"
        class="overflow-hidden flex items-center border border-primary rounded-4 h-space-48"
      >
        <div class="flex items-center justify-center h-full aspect-square bg-tertiary">
          <img src="/images/github.png" alt="GitHub" class="w-space-40" />
        </div>
        <div class="flex flex-col px-space-8">
          <span class="text-md font-medium">View repository</span>
          <span class="text-sm text-secondary">GitHub</span>
        </div>
      </a>
    </div>
    """
  end
end
