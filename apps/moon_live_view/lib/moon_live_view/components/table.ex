defmodule MoonLiveView.Table do
  use MoonLiveView.Component

  attr :size, :string, values: ~w"sm md lg xl", default: "md", doc: "Size of the table"
  attr :class, :string, default: "", doc: "Additional CSS classes for the table"
  attr :rest, :global, doc: "Additional HTML attributes for the table"

  def table(assigns) do
    ~H"""
    <table class={join(["moon-table", get_size(@size), @class])} {@rest}>
      {render_slot(@inner_block)}
    </table>
    """
  end

  attr :class, :string, default: "", doc: "Additional CSS classes for the table head"
  attr :rest, :global, doc: "Additional HTML attributes for the table head"

  slot :inner_block, doc: "Inner content of the table head"

  def table_head(assigns) do
    ~H"""
    <thead class={@class} {@rest}>
        {render_slot(@inner_block)}
    </thead>
    """
  end

  attr :class, :string, default: "", doc: "Additional CSS classes for the table head cell"
  attr :rest, :global, doc: "Additional HTML attributes for the table head cell"

  slot :inner_block, doc: "Inner content of the table head cell"

  def table_head_cell(assigns) do
    ~H"""
    <th class={@class} {@rest}>{render_slot(@inner_block)}</th>
    """
  end

  attr :class, :string, default: "", doc: "Additional CSS classes for the table body"
  attr :rest, :global, doc: "Additional HTML attributes for the table body"

  slot :inner_block, doc: "Inner content of the table body"

  def table_body(assigns) do
    ~H"""
    <tbody class={@class} {@rest}>{render_slot(@inner_block)}</tbody>
    """
  end

  attr :class, :string, default: "", doc: "Additional CSS classes for the table footer"
  attr :rest, :global, doc: "Additional HTML attributes for the table footer"

  slot :inner_block, doc: "Inner content of the table footer"

  def table_footer(assigns) do
    ~H"""
    <tfoot class={@class} {@rest}>{render_slot(@inner_block)}</tfoot>
    """
  end

  attr :class, :string, default: "", doc: "Additional CSS classes for the table caption"
  attr :rest, :global, doc: "Additional HTML attributes for the table caption"

  slot :inner_block, doc: "Inner content of the table caption"

  def table_caption(assigns) do
    ~H"""
    <caption class={@class} {@rest}>{render_slot(@inner_block)}</caption>
    """
  end

  attr :class, :string, default: "", doc: "Additional CSS classes for the table row"
  attr :rest, :global, doc: "Additional HTML attributes for the table row"

  slot :inner_block, doc: "Inner content of the table row"

  def table_row(assigns) do
    ~H"""
    <tr class={@class} {@rest}>{render_slot(@inner_block)}</tr>
    """
  end

  attr :class, :string, default: "", doc: "Additional CSS classes for the table"
  attr :rest, :global, doc: "Additional HTML attributes for the table"

  slot :inner_block, doc: "Inner content of the table cell"

  def table_cell(assigns) do
    ~H"""
    <td class={@class} {@rest}>{render_slot(@inner_block)}</td>
    """
  end

  def get_size("md"), do: ""
  def get_size(size), do: "moon-table-#{size}"
end
