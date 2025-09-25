defmodule MoonLiveViewDocsWeb.TokensData do
  @moduledoc "TokensData"
  import MoonLiveView.Utils
  import MoonAssets
  use Phoenix.Component

  attr :class, :string, required: true

  defp typography_component(assigns) do
    ~H"""
    <div class={[@class, "truncate"]}>
      <span>
        Moon Design System
      </span>
    </div>
    """
  end

  defp get_all_text_bodies() do
    [
      "text-body-100",
      "text-body-200",
      "text-body-300",
      "text-body-400",
      "text-body-500"
    ]
    |> Enum.map(fn n ->
      {n,
       case Regex.run(~r/-(\d+)/, n) do
         [_, digits] ->
           [
             "--text-body-#{digits}-font-weight",
             "--text-body-#{digits}-font-size",
             "--text-body-#{digits}-line-height",
             "--text-body-#{digits}-font-family"
           ]

         _ ->
           n
       end}
    end)
  end

  defp get_all_text_headings() do
    [
      "text-heading-100",
      "text-heading-200",
      "text-heading-300",
      "text-heading-400",
      "text-heading-500"
    ]
    |> Enum.map(fn n ->
      {n,
       case Regex.run(~r/-(\d+)/, n) do
         [_, digits] ->
           [
             "--text-heading-#{digits}-font-weight",
             "--text-heading-#{digits}-font-size",
             "--text-heading-#{digits}-line-height",
             "--text-heading-#{digits}-font-family"
           ]

         _ ->
           n
       end}
    end)
  end

  defp space_component(assigns) do
    ~H"""
    <div class="flex items-center">
      <div class="size-space-8 bg-info rounded-full"></div>
      <div class={[@class, "h-space-40 rounded-8 bg-tertiary"]}></div>
      <div class="size-space-8 bg-info rounded-full" />
    </div>
    """
  end

  defp get_all_spaces() do
    [
      "w-space-0",
      "w-space-1",
      "w-space-2",
      "w-space-4",
      "w-space-6",
      "w-space-8",
      "w-space-10",
      "w-space-12",
      "w-space-14",
      "w-space-16",
      "w-space-18",
      "w-space-20",
      "w-space-24",
      "w-space-28",
      "w-space-32",
      "w-space-36",
      "w-space-40",
      "w-space-48",
      "w-space-56",
      "w-space-64",
      "w-space-72",
      "w-space-80",
      "w-space-88",
      "w-space-96",
      "w-space-104",
      "w-space-112",
      "w-space-120",
      "w-space-128",
      "w-space-136",
      "w-space-144",
      "w-space-152",
      "w-space-160"
    ]
    |> Enum.map(fn n -> {n, n |> String.replace("w-space-", "--dimension-space-")} end)
  end

  defp radius_component(assigns) do
    ~H"""
    <div class={[@class, "h-space-40 w-space-96 bg-info"]}></div>
    """
  end

  defp get_all_radiuses() do
    [
      "rounded-0",
      "rounded-2",
      "rounded-4",
      "rounded-6",
      "rounded-8",
      "rounded-12",
      "rounded-16",
      "rounded-20",
      "rounded-24",
      "rounded-32",
      "rounded-full"
    ]
    |> Enum.map(fn n ->
      {n, "--dimension-" <> n}
    end)
  end

  defp border_width_component(assigns) do
    ~H"""
    <div class={[
      @class,
      "h-space-40 w-space-96 rounded-8 bg-tertiary border-info ring-info ring-inset"
    ]}>
    </div>
    """
  end

  defp get_all_border_widths() do
    [
      "border-0",
      "border-1",
      "border-2",
      "border-4"
    ]
    |> Enum.map(fn n ->
      {n, "--dimension-" <> n}
    end)
  end

  defp shadow_component(assigns) do
    ~H"""
    <div class="p-space-10 w-fit">
      <div class={[@class, "h-space-40 w-space-96 bg-tertiary rounded-8"]}></div>
    </div>
    """
  end

  defp get_all_shadows(),
    do:
      [
        "shadow-100",
        "shadow-200",
        "shadow-300",
        "shadow-400",
        "shadow-500",
        "shadow-600"
      ]
      |> Enum.map(fn n ->
        {n,
         case Regex.run(~r/-(\d+)/, n) do
           [_, digits] ->
             [
               [
                 "--effect-shadow-#{digits}-layer-1-x",
                 "--effect-shadow-#{digits}-layer-1-y",
                 "--effect-shadow-#{digits}-layer-1-blur",
                 "--effect-shadow-#{digits}-layer-1-spread",
                 "--effect-shadow-#{digits}-layer-1-color"
               ],
               [
                 "--effect-shadow-#{digits}-layer-2-x",
                 "--effect-shadow-#{digits}-layer-2-y",
                 "--effect-shadow-#{digits}-layer-2-blur",
                 "--effect-shadow-#{digits}-layer-2-spread",
                 "--effect-shadow-#{digits}-layer-2-color"
               ]
             ]

           _ ->
             n
         end}
      end)

  defp opacity_component(assigns) do
    ~H"""
    <div class={[
      @class,
      "h-space-40 w-space-96 rounded-8 bg-info"
    ]}>
    </div>
    """
  end

  defp get_all_opacities(),
    do:
      [
        "opacity-0",
        "opacity-20",
        "opacity-40",
        "opacity-60",
        "opacity-80",
        "opacity-100"
      ]
      |> Enum.map(fn n -> {n, n |> String.replace("opacity-", "--effect-opacity-")} end)

  defp background_component(assigns) do
    ~H"""
    <div class={[
      @class,
      "h-space-40 w-space-96 rounded-8 border border-primary"
    ]}>
    </div>
    """
  end

  defp get_all_background_colors(),
    do:
      [
        "bg-primary",
        "bg-secondary",
        "bg-tertiary",
        "bg-brand",
        "bg-brand-subtle",
        "bg-inverse",
        "bg-positive",
        "bg-caution",
        "bg-negative",
        "bg-info",
        "bg-discovery",
        "bg-active",
        "bg-hover",
        "bg-backdrop",
        "bg-force-light",
        "bg-force-dark",
        "bg-transparent"
      ]
      |> Enum.map(fn n ->
        {n, n |> String.replace("bg-", "--semantic-background-")}
      end)

  defp text_component(assigns) do
    ~H"""
    <span
      :if={@class == "text-inverse"}
      class={[@class, "text-body-400 p-space-4 rounded-4 bg-inverse"]}
    >
      Moon Design System
    </span>
    <span
      :if={@class == "text-force-light"}
      class={[@class, "text-body-400 font-medium p-space-4 rounded-4 bg-inverse dark:bg-tertiary"]}
    >
      Moon Design System
    </span>
    <span
      :if={@class == "text-force-dark"}
      class={[@class, "text-body-400 font-medium p-space-4 rounded-4 dark:bg-inverse"]}
    >
      Moon Design System
    </span>
    <span
      :if={@class not in ["text-inverse", "text-force-light", "text-force-dark"]}
      class={[@class, "text-body-400 font-medium"]}
    >
      Moon Design System
    </span>
    """
  end

  defp get_all_text_colors(),
    do:
      [
        "text-primary",
        "text-secondary",
        "text-brand",
        "text-inverse",
        "text-positive",
        "text-caution",
        "text-negative",
        "text-info",
        "text-discovery",
        "text-active",
        "text-link",
        "text-force-light",
        "text-force-dark"
      ]
      |> Enum.map(fn n ->
        {n, "--semantic-" <> n}
      end)

  defp icon_component(assigns) do
    ~H"""
    <div
      :if={@class == "icon-inverse"}
      class="flex items-center justify-center p-space-4 rounded-4 size-space-32 bg-inverse"
    >
      <.icon name="star" class={@class} />
    </div>
    <div
      :if={@class == "icon-force-light"}
      class="flex items-center justify-center p-space-4 rounded-4 size-space-32 bg-inverse dark:bg-tertiary"
    >
      <.icon name="star" class={@class} />
    </div>
    <div
      :if={@class == "icon-force-dark"}
      class="flex items-center justify-center p-space-4 rounded-4 size-space-32 dark:bg-inverse"
    >
      <.icon name="star" class={@class} />
    </div>
    <.icon
      :if={@class not in ["icon-inverse", "icon-force-light", "icon-force-dark"]}
      name="star"
      class={@class}
    />
    """
  end

  defp get_all_icon_colors(),
    do:
      [
        "icon-primary",
        "icon-secondary",
        "icon-brand",
        "icon-inverse",
        "icon-positive",
        "icon-caution",
        "icon-negative",
        "icon-info",
        "icon-discovery",
        "icon-active",
        "icon-force-light",
        "icon-force-dark"
      ]
      |> Enum.map(fn n ->
        {n, "--semantic-" <> n}
      end)

  defp border_color_component(assigns) do
    ~H"""
    <div class={[@class, "w-space-96 rounded-full border-t-4"]}></div>
    """
  end

  defp get_all_border_colors(),
    do:
      [
        "border-primary",
        "border-secondary",
        "border-brand",
        "border-brand-subtle",
        "border-positive",
        "border-caution",
        "border-negative",
        "border-info",
        "border-discovery",
        "border-active",
        "border-force-light",
        "border-force-dark"
      ]
      |> Enum.map(fn n ->
        {n, "--semantic-" <> n}
      end)

  def tokens_data_text_body do
    get_all_text_bodies()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_text_body-" <> gen_rand_id(),
        visual: typography_component(%{class: class}),
        name: class,
        value: value |> Enum.join(","),
        description: "description"
      }
    end)
  end

  def tokens_data_text_heading do
    get_all_text_headings()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_text_heading-" <> gen_rand_id(),
        visual: typography_component(%{class: class}),
        name: class,
        value: value |> Enum.join(","),
        description: "description"
      }
    end)
  end

  def tokens_data_space do
    get_all_spaces()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_space-" <> gen_rand_id(),
        visual: space_component(%{class: class}),
        name: class |> String.replace("w-", "*-"),
        value: value,
        description: "description"
      }
    end)
  end

  def tokens_data_radius do
    get_all_radiuses()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_radius-" <> gen_rand_id(),
        visual: radius_component(%{class: class}),
        name: class,
        value: value,
        description: "description"
      }
    end)
  end

  def tokens_data_border_width do
    get_all_border_widths()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_border_width-" <> gen_rand_id(),
        visual: border_width_component(%{class: class}),
        name: class,
        value: value,
        description: "description"
      }
    end)
  end

  def tokens_data_shadow do
    get_all_shadows()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_shadow-" <> gen_rand_id(),
        visual: shadow_component(%{class: class}),
        name: class,
        value:
          value
          |> Enum.map(&Enum.join(&1, ","))
          |> Enum.join(","),
        description: "description"
      }
    end)
  end

  def tokens_data_opacity do
    get_all_opacities()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_opacity-" <> gen_rand_id(),
        visual: opacity_component(%{class: class}),
        name: class,
        value: value,
        description: "description"
      }
    end)
  end

  def tokens_data_background_color do
    get_all_background_colors()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_background_color-" <> gen_rand_id(),
        visual: background_component(%{class: class}),
        name: class,
        value: value,
        description: "description"
      }
    end)
  end

  def tokens_data_text_color do
    get_all_text_colors()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_text_color-" <> gen_rand_id(),
        visual: text_component(%{class: class}),
        name: class,
        value: value,
        description: "description"
      }
    end)
  end

  def tokens_data_icon_color do
    get_all_icon_colors()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_icon_color-" <> gen_rand_id(),
        visual: icon_component(%{class: class}),
        name: class,
        value: value,
        description: "description"
      }
    end)
  end

  def tokens_data_border_color do
    get_all_border_colors()
    |> Enum.map(fn {class, value} ->
      %{
        id: "tokens_data_border_color-" <> gen_rand_id(),
        visual: border_color_component(%{class: class}),
        name: class,
        value: value,
        description: "description"
      }
    end)
  end
end
