defmodule MoonLive.Table do
  use MoonLive.Component

  attr :rows, :list, default: [], doc: "List of table rows"
  attr :size, :string, values: ~w"sm md lg xl", default: "md", doc: "Size of the table"
  attr :class, :string, default: "", doc: "Additional CSS classes for the table"
  attr :rest, :global, doc: "Additional HTML attributes for the table"

  slot :col, doc: "List of table items" do
    attr :class, :string, doc: "Label of the table item"
  end

  slot :row, doc: "List of table rows" do
    attr :class, :string, doc: "Additional CSS classes for the table row"
  end

  def table(assigns) do
    ~H"""
    <table class={["moon-table", get_size(@size), @class]} {@rest}>
      <thead>
        <th :for={col <- @col} class={col[:class] || ""}>{render_slot(col)}</th>
      </thead>
      <tbody>
        <tr :for={row <- @row} class={row[:class] || ""}>
          {render_slot(row)}
        </tr>
      </tbody>
    </table>
    """
  end

  attr :class, :string, default: "", doc: "Additional CSS classes for the table"
  attr :rest, :global, doc: "Additional HTML attributes for the table"

  slot :inner_block, doc: "Inner content of the table cell"

  def table_cell(assigns) do
    ~H"""
    <td class={["moon-table-cell", @class]} {@rest}>{render_slot(@inner_block)}</td>
    """
  end

  def get_size("md"), do: ""
  def get_size(size), do: "moon-table-#{size}"
end
