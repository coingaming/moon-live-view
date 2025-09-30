defmodule Storybook.Components.CoreComponents.Table do
  use PhoenixStorybook.Story, :component
  alias MoonLiveView.Table

  def function, do: &Table.table/1

  def imports, do: [{Table, [table_cell: 1]}]

  def variations do
    [
      %Variation{
        id: :default,
        description: "Default",
        slots: [
          """
          <:col>Title</:col>
          <:col>Title</:col>
          <:col>Title</:col>
          <:row>
            <.table_cell>Cell</.table_cell>
            <.table_cell>Cell</.table_cell>
            <.table_cell>Cell</.table_cell>
          </:row>
          <:row>
            <.table_cell>Cell</.table_cell>
            <.table_cell>Cell</.table_cell>
            <.table_cell>Cell</.table_cell>
          </:row>
          <:row>
            <.table_cell>Cell</.table_cell>
            <.table_cell>Cell</.table_cell>
            <.table_cell>Cell</.table_cell>
          </:row>
          """
        ]
      }
    ]
  end
end
