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
      },
      %Variation{
        id: :more_data,
        slots: [
          """
          <:col>Id</:col>
          <:col>Username</:col>
          <:col>Email</:col>
          <:col>Is Unicorn?</:col>
          <:row>
            <.table_cell>#1</.table_cell>
            <.table_cell>Alice Smith #1</.table_cell>
            <.table_cell>alice.smith1@example.com</.table_cell>
            <.table_cell>false</.table_cell>
          </:row>
          <:row>
            <.table_cell>#2</.table_cell>
            <.table_cell>Carlos Rivera #2</.table_cell>
            <.table_cell>carlos.r2@gmail.com</.table_cell>
            <.table_cell>true</.table_cell>
          </:row>
          <:row>
            <.table_cell>#3</.table_cell>
            <.table_cell>Eva Müller #3</.table_cell>
            <.table_cell>eva.mueller3@mail.com</.table_cell>
            <.table_cell>false</.table_cell>
          </:row>
          <:row>
            <.table_cell>#4</.table_cell>
            <.table_cell>Tom Lee #4</.table_cell>
            <.table_cell>tom.lee4@inbox.org</.table_cell>
            <.table_cell>true</.table_cell>
          </:row>
          <:row>
            <.table_cell>#5</.table_cell>
            <.table_cell>Nina Patel #5</.table_cell>
            <.table_cell>nina.patel5@webmail.com</.table_cell>
            <.table_cell>false</.table_cell>
          </:row>
          <:row>
            <.table_cell>#6</.table_cell>
            <.table_cell>John Doe #6</.table_cell>
            <.table_cell>user.6@gmail.com</.table_cell>
            <.table_cell>true</.table_cell>
          </:row>
          <:row>
            <.table_cell>#7</.table_cell>
            <.table_cell>George Wang #7</.table_cell>
            <.table_cell>george7@provider.net</.table_cell>
            <.table_cell>false</.table_cell>
          </:row>
          <:row>
            <.table_cell>#8</.table_cell>
            <.table_cell>Lena Novak #8</.table_cell>
            <.table_cell>lena.novak8@domain.eu</.table_cell>
            <.table_cell>true</.table_cell>
          </:row>
          <:row>
            <.table_cell>#9</.table_cell>
            <.table_cell>Omar Farah #9</.table_cell>
            <.table_cell>omar9@nowhere.com</.table_cell>
            <.table_cell>false</.table_cell>
          </:row>
          <:row>
            <.table_cell>#10</.table_cell>
            <.table_cell>Sofia Rossi #10</.table_cell>
            <.table_cell>sofia.rossi10@gmail.com</.table_cell>
            <.table_cell>true</.table_cell>
          </:row>
          """
        ]
      }
    ]
  end
end
