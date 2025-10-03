defmodule MoonLiveViewDocsWeb.CodePreview do
  @moduledoc """
    Widget with code preview for examples
  """

  use Phoenix.Component
  use MoonLiveView
  alias Makeup
  import MoonLiveViewDocs.Icon

  def code_preview_styles(assigns) do
    assigns = assign(assigns, :css, Makeup.stylesheet(:monokai_style))

    ~H"""
    <style>
      <%= Phoenix.HTML.raw(@css) %>
    </style>
    """
  end

  attr(:id, :string, required: true)
  attr(:code, :string, required: true)

  def code_preview(assigns) do
    ~H"""
    <div
      id={"code-preview-root-#{@id}"}
      phx-hook="CodePreviewHook"
      data-code-preview
      id={@id}
      class="dark-theme bg-tertiary relative text-primary overflow-hidden border border-t-0 border-primary rounded-b-8"
    >
      <div
        data-code-preview-wrapper
        class="max-h-space-128 transition-[max-height] ease-in-out overflow-hidden overflow-x-auto overflow-y-scroll [&_pre]:!p-space-14 [&_pre]:!pb-space-48 [&_pre]:lg:!pe-space-48 [&_pre]:!text-body-300 [&_pre]:!bg-tertiary"
      >
        {@code
        |> Makeup.highlight(lexer: Makeup.Lexers.HEExLexer)
        |> Phoenix.HTML.raw()}
      </div>
      <div
        data-code-preview-button-wrapper
        class="dark-theme absolute bottom-0 inset-x-0 h-space-128 flex items-end z-0 bg-gradient-to-b from-25% from-transparent to-tertiary"
      >
        <.button
          data-code-preview-button
          variant="ghost"
          class="active:!scale-100 !bg-tertiary !text-force-light"
        >
          <span id="toggleSpan">Expand</span>
          <:end_content>
            <.icon name="chevron-down" />
          </:end_content>
        </.button>
      </div>
    </div>
    """
  end
end
