defmodule MoonLiveViewDocsWeb.DocsComponents do
  @moduledoc false

  use Phoenix.Component
  use MoonLiveView
  import MoonLiveViewDocs.Icon

  @doc """
    Main Page Head Component
  """
  attr :title, :string, required: true
  attr :tags, :list, default: []
  slot :description

  def main_page_head_component(assigns) do
    ~H"""
    <div class="flex max-w-3xl flex-col gap-space-16 lg:gap-space-24">
      <div class="flex flex-col">
        <h1 class="text-heading-500">{@title}</h1>
        <.title_tags tags={@tags} />
      </div>
      <div class="text-heading-200">
        {render_slot(@description)}
      </div>
    </div>
    """
  end

  @doc """
    Page Head Component
  """
  attr :title, :string, required: true
  attr :tags, :list, default: []
  slot :description

  def page_head_component(assigns) do
    ~H"""
    <div class="flex max-w-3xl flex-col gap-space-16 lg:gap-space-24 text-body-400">
      <div class="flex flex-col gap-space-8">
        <h1 class="flex items-baseline gap-space-12 text-heading-300">
          {@title}
        </h1>
        <.title_tags tags={@tags} />
      </div>
      {render_slot(@description)}
    </div>
    """
  end

  @doc """
   Tags List Title
  """
  attr :tags, :list, required: true
  attr :class, :string, default: ""

  def title_tags(assigns) do
    ~H"""
    <div class={["flex gap-x-space-8", @class]}>
      <.tag :for={tag <- @tags}>
        {tag}
      </.tag>
    </div>
    """
  end

  @doc """
    Logo component.
  """
  def logo(assigns) do
    ~H"""
    <svg width="70" height="40" viewBox="0 0 70 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_4061_3084)">
        <path
          d="M4.19298 27.8885H0V12.2242H4.19298V14.2744H4.22499C5.47328 12.7688 7.16967 12 8.89808 12C10.9466 12 12.5789 12.7688 13.5072 14.4666H13.5712C14.8515 12.8329 16.8039 12 19.0444 12C22.4052 12 24.5497 14.0181 24.5497 18.8231V27.8885H20.3568V19.8161C20.3568 17.3175 19.5886 15.7479 17.6361 15.7479C15.8757 15.7479 14.4354 17.2535 14.4354 20.0724V27.8885H10.2424V19.8161C10.2424 17.3175 9.4102 15.7479 7.48975 15.7479C5.60131 15.7479 4.19298 17.2535 4.19298 20.0724V27.8885Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M44.4547 20.2753C44.4547 24.6627 40.8899 28.2195 36.4926 28.2195C32.0953 28.2195 28.5305 24.6627 28.5305 20.2753C28.5305 15.8878 32.0953 12.331 36.4926 12.331C40.8899 12.331 44.4547 15.8878 44.4547 20.2753ZM39.1466 20.2753C39.1466 21.7378 37.9584 22.9233 36.4926 22.9233C35.0268 22.9233 33.8386 21.7378 33.8386 20.2753C33.8386 18.8128 35.0268 17.6272 36.4926 17.6272C37.9584 17.6272 39.1466 18.8128 39.1466 20.2753Z"
          fill="currentColor"
        />
        <path
          d="M51.0898 14.9791C51.0898 16.4416 49.9016 17.6272 48.4358 17.6272C46.97 17.6272 45.7817 16.4416 45.7817 14.9791C45.7817 13.5166 46.97 12.331 48.4358 12.331C49.9016 12.331 51.0898 13.5166 51.0898 14.9791Z"
          fill="currentColor"
        />
        <path
          d="M59.2679 27.8885H55.0711V12.2242H59.2679V14.2423H59.3319C60.5813 12.7688 62.3754 12 64.3296 12C67.6614 12 70 13.7939 70 18.5989V27.8885H65.8033V19.656C65.8033 16.6769 64.7461 15.7479 62.7918 15.7479C60.6775 15.7479 59.2679 17.2214 59.2679 20.0404V27.8885Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_4061_3084">
          <rect width="70" height="16.2195" fill="white" transform="translate(0 12)" />
        </clipPath>
      </defs>
    </svg>
    """
  end

  @doc false

  def doc_header(assigns) do
    assigns = assign(assigns, :version, fetch_version())

    ~H"""
    <header class="sticky flex top-0 z-50 py-space-16 lg:p-space-0 lg:h-space-72 justify-between items-center border-b border-primary bg-primary text-primary">
      <div class="w-72 flex items-center gap-space-12 lg:border-e lg:border-primary h-full lg:ps-space-24 ps-space-20">
        <a href="/" class="flex items-center gap-space-12">
          <.logo />
          <p class="text-body-300 text-secondary">{assigns.version}</p>
        </a>
      </div>
      <!-- BreadCrumbs here -->
      <div />
      <div class="flex items-center gap-space-12 lg:gap-space-16 lg:pe-space-24 pe-space-20">
        <!-- Search here -->
        <!-- Theme Switcher here -->
        <.theme_switcher />
        <!-- RTL Switcher here -->
        <.layout_switcher />
        <!-- Icon Button for menu here -->
      </div>
    </header>
    """
  end

  @doc false
  def doc_footer(assigns) do
    ~H"""
    <footer class="flex flex-col gap-space-16 pt-space-32 pb-space-24 lg:pb-space-48 items-center text-body-300 text-primary">
      <div class="flex gap-x-space-16 gap-y-space-24 flex-wrap justify-center items-center text-secondary">
        <a
          href="https://github.com/moondesignsystem/liveview"
          class="hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
        <span>•</span>
        <a
          href="https://www.figma.com/community/file/1002945721703152933"
          class="hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Figma
        </a>
        <span>•</span>
        <a href="https://moonds.medium.com/" class="hover:underline" target="_blank" rel="noreferrer">
          Medium
        </a>
        <span>•</span>
        <a
          href="https://www.linkedin.com/company/moon-io/"
          class="hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </footer>
    """
  end

  @doc false
  def theme_switcher(assigns) do
    ~H"""
    <.button
      id="global-dark-mode"
      phx-click="set_theme"
      phx-value-theme="dark"
      variant="outline"
      class="dark:hidden"
    >
      <.icon id="dark-theme-icon" name="moon" />
    </.button>
    <.button
      id="global-light-mode"
      phx-click="set_theme"
      phx-value-theme="light"
      variant="outline"
      class="hidden dark:flex"
    >
      <.icon id="light-theme-icon" name="sun" />
    </.button>
    """
  end

  @doc false
  def layout_switcher(assigns) do
    ~H"""
    <.button
      class="block rtl:hidden"
      phx-click="set_dir_layout"
      phx-value-dir="rtl"
      variant="outline"
    >
      <.icon id="rtl-icon" name="sidebar-right" />
    </.button>
    <.button
      class="hidden rtl:block"
      phx-click="set_dir_layout"
      phx-value-dir="ltr"
      variant="outline"
    >
      <.icon id="ltr-icon" name="sidebar-left" />
    </.button>
    """
  end

  def fetch_version do
    case File.read("VERSION") do
      {:ok, version} ->
        String.trim(version)

      {:error, reason} ->
        IO.puts("Error reading version: #{reason}")
        "0.0.1"
    end
  end

  attr :title, :string, default: " "
  slot :description
  slot :code

  def step(assigns) do
    ~H"""
    <div class="flex flex-col gap-space-12">
      <h3 :if={@title != ""} class="text-xl font-bold">{@title}</h3>
      <p>{render_slot(@description)}</p>
      {render_slot(@code)}
    </div>
    """
  end
end
