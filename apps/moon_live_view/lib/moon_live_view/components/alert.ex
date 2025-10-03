defmodule MoonLiveView.Alert do
  use MoonLiveView.Component
  alias Phoenix.LiveView.JS

  attr(:variant, :string, values: ~w"fill soft outline", default: "fill")
  attr(:context, :string, values: ~w"brand neutral positive negative caution info", default: "brand")

  attr(:has_close_button, :boolean, default: false, doc: "If true, the close button will be rendered")
  attr(:on_close, {:fun, 1}, default: nil, doc: "Function to call on close button click")

  slot(:meta, doc: "Meta content of the Alert") do
    attr(:class, :string, doc: "CSS class for the meta content")
  end

  slot(:content) do
    attr(:class, :string, doc: "CSS class for the content")
  end

  slot(:inner_block, doc: "Inner block of the Alert")

  def alert(assigns) do
    attrs = assigns_to_attributes(assigns, [:variant, :context])
    assigns = assign(assigns, attrs: attrs)

    ~H"""
    <div class={join(["moon-alert", get_variant(@variant), get_context(@context)])}>
      {render_slot(@inner_block)}
      <div :if={@meta != []} class="moon-alert-meta">
        {render_slot(@meta)}
      </div>

      <div :if={@content != []} class="moon-alert-content">
        {render_slot(@content)}
      </div>
    </div>
    """
  end

  attr :class, :string, default: "", doc: "CSS class for the Alert action button"
  attr :rest, :global, doc: "Additional HTML attributes for the Alert action button"

  slot :inner_block, doc: "Inner block of the Alert action button"

  def alert_action_button(assigns) do
    ~H"""
    <button class={join(["moon-alert-action", @class])} {@rest}>
      {render_slot(@inner_block)}
    </button>
    """
  end

  attr :class, :string, default: "", doc: "CSS class for the Alert action button"
  attr :rest, :global, doc: "Additional HTML attributes for the Alert action button"

  slot :inner_block, doc: "Inner block of the Alert action button"

  def alert_close_button(assigns) do
    ~H"""
    <button class={join(["moon-alert-close", @class])} phx-click={hide_alert()} {@rest}>
      <%= if @inner_block != [] do %>
        {render_slot(@inner_block)}
      <% else %>
        <.component_icon name="close" />
      <% end %>
    </button>
    """
  end

  defp hide_alert(js \\ %JS{}) do
    js
    |> JS.hide(to: {:closest, ".moon-alert"}, transition: "fade-out")
  end

  defp get_variant("fill"), do: ""
  defp get_variant(variant), do: "moon-alert-#{variant}"

  defp get_context("brand"), do: ""
  defp get_context(context), do: "moon-alert-#{context}"
end
