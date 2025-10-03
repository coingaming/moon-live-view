defmodule Storybook.Components.CoreComponents.Table do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Table

  def function, do: &Table.table/1

  def imports,
    do: [{Table, [table_head: 1, table_head_cell: 1, table_body: 1, table_row: 1, table_cell: 1]}]

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        slots: [
          """
          <.table_head>
            <.table_row>
              <.table_head_cell>Title</.table_head_cell>
              <.table_head_cell>Title</.table_head_cell>
              <.table_head_cell>Title</.table_head_cell>
            </.table_row>
          </.table_head>
          <.table_body>
            <.table_row>
              <.table_cell>Cell</.table_cell>
              <.table_cell>Cell</.table_cell>
              <.table_cell>Cell</.table_cell>
            </.table_row>
            <.table_row>
              <.table_cell>Cell</.table_cell>
              <.table_cell>Cell</.table_cell>
              <.table_cell>Cell</.table_cell>
            </.table_row>
            <.table_row>
              <.table_cell>Cell</.table_cell>
              <.table_cell>Cell</.table_cell>
              <.table_cell>Cell</.table_cell>
            </.table_row>
            <.table_row>
              <.table_cell>Cell</.table_cell>
              <.table_cell>Cell</.table_cell>
              <.table_cell>Cell</.table_cell>
            </.table_row>
            <.table_row>
              <.table_cell>Cell</.table_cell>
              <.table_cell>Cell</.table_cell>
              <.table_cell>Cell</.table_cell>
            </.table_row>
          </.table_body>
          """
        ]
      }
    ]
  end
end
